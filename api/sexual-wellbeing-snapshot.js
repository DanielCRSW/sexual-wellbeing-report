// api/sexual-wellbeing-snapshot.js
// Lead magnet endpoint for the Sexual Wellbeing Snapshot (NATSAL-SW)
// Stack: Tally webhook → score → Brevo Contacts API + Brevo transactional email

// ─── PDF links ────────────────────────────────────────────────────────────────
const PDF_LINKS = {
  Lower:    'https://raw.githubusercontent.com/DanielCRSW/sexual-wellbeing-report/main/CRSW_SexualWellbeing_Snapshot_Lower.pdf',
  Moderate: 'https://raw.githubusercontent.com/DanielCRSW/sexual-wellbeing-report/main/CRSW_SexualWellbeing_Snapshot_Moderate.pdf',
  Higher:   'https://raw.githubusercontent.com/DanielCRSW/sexual-wellbeing-report/main/CRSW_SexualWellbeing_Snapshot_Higher.pdf',
};

// ─── Tally field labels ───────────────────────────────────────────────────────
// These must exactly match the "Label" values you set in Tally for each question.
// Adjust if you use different names in the form builder.
const FIELD = {
  // Contact
  email:          'Email address',
  // NATSAL-SW items 1–13
  natsal_1:       'NATSAL1',
  natsal_2:       'NATSAL2',
  natsal_3:       'NATSAL3',
  natsal_4:       'NATSAL4',   // reverse scored
  natsal_5:       'NATSAL5',   // reverse scored
  natsal_6:       'NATSAL6',   // reverse scored
  natsal_7:       'NATSAL7',   // reverse scored
  natsal_8:       'NATSAL8',   // reverse scored (sexually active only)
  natsal_9:       'NATSAL9',   // reverse scored (sexually active only)
  natsal_10:      'NATSAL10',
  natsal_11:      'NATSAL11',
  natsal_12:      'NATSAL12',
  natsal_13:      'NATSAL13',  // sexually active only
  // SSE items
  sse_comm:       'SSE_Communication',
  sse_pleasure:   'SSE_Pleasure',
  // Demographics
  age:            'Age',
  gender:         'Gender',
  gender_diverse: 'GenderDiverse',   // is gender identity different from sex assigned at birth?
  orientation:    'SexualOrientation',
  relationship:   'RelationshipStatus',
  location:       'Location',
  // Market research
  topics:         'InterestedTopics',
  referral:       'HowDidYouHear',
};

// Likert map: text option → numeric score
const LIKERT_5 = {
  'Strongly agree':    5,
  'Agree':             4,
  'Neither agree nor disagree': 3,
  'Disagree':          2,
  'Strongly disagree': 1,
};

const CONFIDENCE_5 = {
  'Completely confident':  5,
  'Mostly confident':      4,
  'Somewhat confident':    3,
  'Not very confident':    2,
  'Not at all confident':  1,
};

const REVERSE_ITEMS = new Set(['natsal_4','natsal_5','natsal_6','natsal_7','natsal_8','natsal_9']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function reverseScore(score) {
  return 6 - score;
}

function classifyNatsal(mean) {
  if (mean < 2.5)  return 'Lower';
  if (mean <= 3.5) return 'Moderate';
  return 'Higher';
}

function classifySSE(mean) {
  if (mean < 2.5)  return 'lower';
  if (mean <= 3.5) return 'moderate';
  return 'higher';
}

/**
 * Extract a field value from Tally's fields array by its label.
 * Tally sends fields as: [{ label, type, value }, ...]
 */
function getField(fields, label) {
  const f = fields.find(f => f.label === label);
  return f ? f.value : null;
}

/**
 * Convert a Tally Likert text response to a numeric score.
 * Returns null if the field is missing or unrecognised (e.g. skipped conditional).
 */
function likertScore(fields, fieldLabel, map) {
  const val = getField(fields, fieldLabel);
  if (!val || !(val in map)) return null;
  return map[val];
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreNatsal(fields) {
  const keys = [
    'natsal_1','natsal_2','natsal_3','natsal_4','natsal_5','natsal_6',
    'natsal_7','natsal_8','natsal_9','natsal_10','natsal_11','natsal_12','natsal_13',
  ];

  const scores = [];
  for (const key of keys) {
    let raw = likertScore(fields, FIELD[key], LIKERT_5);
    if (raw === null) continue; // item was skipped (conditional items 8, 9, 13)
    if (REVERSE_ITEMS.has(key)) raw = reverseScore(raw);
    scores.push(raw);
  }

  if (scores.length === 0) return { mean: null, category: null, itemsAnswered: 0 };

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    mean: Math.round(mean * 100) / 100,
    category: classifyNatsal(mean),
    itemsAnswered: scores.length,
  };
}

function scoreSSE(fields) {
  const comm    = likertScore(fields, FIELD.sse_comm,    CONFIDENCE_5);
  const pleasure = likertScore(fields, FIELD.sse_pleasure, CONFIDENCE_5);
  const scores  = [comm, pleasure].filter(s => s !== null);
  if (scores.length === 0) return { mean: null, category: null };
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    mean: Math.round(mean * 100) / 100,
    category: classifySSE(mean),
  };
}

// ─── Brevo helpers ────────────────────────────────────────────────────────────

async function upsertBrevoContact({ email, natsalCategory, sseCategory, demographics }) {
  const body = {
    email,
    updateEnabled: true,
    listIds: [3], // TODO: replace with your actual Brevo list ID for lead magnet contacts
    attributes: {
      NATSAL_CATEGORY:  natsalCategory,
      SSE_CATEGORY:     sseCategory,
      AGE:              demographics.age        || '',
      GENDER:           demographics.gender      || '',
      GENDER_DIVERSE:   demographics.genderDiverse || '',
      ORIENTATION:      demographics.orientation || '',
      RELATIONSHIP:     demographics.relationship || '',
      LOCATION:         demographics.location    || '',
      TOPICS:           Array.isArray(demographics.topics) ? demographics.topics.join(', ') : (demographics.topics || ''),
      REFERRAL:         demographics.referral    || '',
      LEAD_SOURCE:      'Sexual Wellbeing Snapshot',
    },
  };

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method:  'POST',
    headers: {
      'accept':       'application/json',
      'content-type': 'application/json',
      'api-key':      process.env.BREVO_API_KEY,
    },
    body: JSON.stringify(body),
  });

  // 201 = created, 204 = updated, both are success
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Brevo contacts API error ${res.status}: ${text}`);
  }
}

async function sendResultEmail({ email, category }) {
  const subjectMap = {
    Lower:    'Your Sexual Wellbeing Snapshot results',
    Moderate: 'Your Sexual Wellbeing Snapshot results',
    Higher:   'Your Sexual Wellbeing Snapshot results',
  };

  const introMap = {
    Lower:    "Thank you for completing the Sexual Wellbeing Snapshot. Your results and a personalised resource are ready for you below.",
    Moderate: "Thank you for completing the Sexual Wellbeing Snapshot. Your results and a personalised resource are ready for you below.",
    Higher:   "Thank you for completing the Sexual Wellbeing Snapshot. Your results and a personalised resource are ready for you below.",
  };

  const pdfLink = PDF_LINKS[category];

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <img src="https://cdn.prod.website-files.com/634b8f3a862a6780aba57bb8/634b926d6668dd1ede85b43f_CRSW_Web_Logo.png"
           alt="Centre for Relational and Sexual Wellbeing"
           style="height: 50px; margin-bottom: 24px;" />
      <p>${introMap[category]}</p>
      <p><strong>Your result: ${category} Sexual Wellbeing</strong></p>
      <p>
        <a href="${pdfLink}"
           style="display: inline-block; background-color: #1ab8c4; color: #ffffff;
                  padding: 12px 24px; border-radius: 6px; text-decoration: none;
                  font-weight: bold;">
          Download your personalised resource
        </a>
      </p>
      <p style="margin-top: 32px; font-size: 13px; color: #777;">
        This resource is for informational and self-reflection purposes only. It is not a clinical
        assessment and does not constitute a diagnosis. If you have concerns about your sexual
        health or mental health, please consult a qualified healthcare professional.
      </p>
      <p style="font-size: 13px; color: #777;">
        <a href="https://www.centrersw.com" style="color: #1ab8c4;">centrersw.com</a>
      </p>
    </div>
  `;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method:  'POST',
    headers: {
      'accept':       'application/json',
      'content-type': 'application/json',
      'api-key':      process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender:     { name: 'Centre for Relational and Sexual Wellbeing', email: 'hello@centrersw.com' },
      to:         [{ email }],
      subject:    subjectMap[category],
      htmlContent,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo send email error ${res.status}: ${text}`);
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Tally sends { eventId, eventType, createdAt, data: { fields: [...] } }
    if (!payload?.data?.fields) {
      return res.status(400).json({ error: 'Invalid Tally payload' });
    }

    const { fields } = payload.data;

    // Extract email
    const email = getField(fields, FIELD.email);
    if (!email) {
      console.error('No email in submission');
      return res.status(400).json({ error: 'No email address in submission' });
    }

    // Score
    const natsal = scoreNatsal(fields);
    const sse    = scoreSSE(fields);

    if (!natsal.category) {
      console.error('Could not score NATSAL-SW — no valid items found');
      return res.status(400).json({ error: 'Could not score assessment' });
    }

    // Demographics
    const demographics = {
      age:           getField(fields, FIELD.age),
      gender:        getField(fields, FIELD.gender),
      genderDiverse: getField(fields, FIELD.gender_diverse),
      orientation:   getField(fields, FIELD.orientation),
      relationship:  getField(fields, FIELD.relationship),
      location:      getField(fields, FIELD.location),
      topics:        getField(fields, FIELD.topics),
      referral:      getField(fields, FIELD.referral),
    };

    // Add/update contact in Brevo, then send result email
    await upsertBrevoContact({
      email,
      natsalCategory: natsal.category,
      sseCategory:    sse.category || '',
      demographics,
    });

    await sendResultEmail({ email, category: natsal.category });

    console.log(`Snapshot complete: ${email} → ${natsal.category} (mean ${natsal.mean}, n=${natsal.itemsAnswered}) | SSE: ${sse.category} (mean ${sse.mean})`);

    return res.status(200).json({ success: true, category: natsal.category });

  } catch (err) {
    console.error('Snapshot handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
