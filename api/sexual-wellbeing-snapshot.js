// api/sexual-wellbeing-snapshot.js
// Lead magnet endpoint for the Sexual Wellbeing Snapshot (NATSAL-SW)
// Stack: Tally webhook → score → Brevo Contacts API + Brevo transactional email

// ─── PDF links ────────────────────────────────────────────────────────────────
const PDF_LINKS = {
  Lower:    'https://raw.githubusercontent.com/DanielCRSW/sexual-wellbeing-report/main/CRSW_SexualWellbeing_Snapshot_Lower.pdf',
  Moderate: 'https://raw.githubusercontent.com/DanielCRSW/sexual-wellbeing-report/main/CRSW_SexualWellbeing_Snapshot_Moderate.pdf',
  Higher:   'https://raw.githubusercontent.com/DanielCRSW/sexual-wellbeing-report/main/CRSW_SexualWellbeing_Snapshot_Higher.pdf',
};

// ─── Tally Matrix block labels ────────────────────────────────────────────────
// These must exactly match the "Label" you give each Matrix block in Tally.
const MATRIX_LABEL_NATSAL = 'NATSAL-SW';
const MATRIX_LABEL_SSE    = 'SSE';

// ─── Tally non-matrix field labels ───────────────────────────────────────────
// Must exactly match the "Label" of each individual question block in Tally.
const FIELD = {
  email:          'Email address',
  age:            'Age',
  gender:         'Gender',
  gender_diverse: 'GenderDiverse',
  orientation:    'SexualOrientation',
  relationship:   'RelationshipStatus',
  location:       'Location',
  topics:         'InterestedTopics',
  referral:       'HowDidYouHear',
};

// ─── NATSAL-SW item definitions ───────────────────────────────────────────────
// text: the exact row label used in the Tally Matrix (what respondents see)
// reverse: whether this item is reverse-scored
const NATSAL_ITEMS = [
  { text: 'I feel in control of my sexual thoughts and desires',                                           reverse: false },
  { text: 'I feel comfortable with my sexual identity and preferences',                                    reverse: false },
  { text: 'People close to me accept my sexual identity and preferences',                                  reverse: false },
  { text: 'Some of my sexual thoughts and desires make me feel ashamed',                                   reverse: true  },
  { text: 'I worry about what might happen to me in my future sex life',                                   reverse: true  },
  { text: 'In the last month, I felt upset with myself about mistakes I made in my sexual past',           reverse: true  },
  { text: 'In the last month, I felt upset with others about things they did to me in my sexual past',    reverse: true  },
  { text: 'I have unwanted thoughts during sexual activities',                                             reverse: true  },
  { text: 'During sexual activities, I felt vulnerable when I did not want to be',                        reverse: true  },
  { text: 'In the last month, I only did sexual activities that I really wanted to do',                    reverse: false },
  { text: 'My sex life is pleasurable',                                                                    reverse: false },
  { text: 'I have someone I can talk to openly about my sex life',                                         reverse: false },
  { text: 'I feel able to be "in the moment" and focused during sexual activities',                        reverse: false },
];

// ─── SSE item definitions ─────────────────────────────────────────────────────
const SSE_ITEMS = [
  'I feel confident communicating my sexual needs and desires to a partner',
  'I feel confident in my ability to experience sexual pleasure',
];

// ─── Scoring maps ─────────────────────────────────────────────────────────────
const LIKERT_5 = {
  'Strongly agree':             5,
  'Agree':                      4,
  'Neither agree nor disagree': 3,
  'Disagree':                   2,
  'Strongly disagree':          1,
};

const CONFIDENCE_5 = {
  'Completely confident': 5,
  'Mostly confident':     4,
  'Somewhat confident':   3,
  'Not very confident':   2,
  'Not at all confident': 1,
};

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
 * Get a field value from Tally's flat fields array by its label.
 * Used for non-matrix question types.
 */
function getField(fields, label) {
  const f = fields.find(f => f.label === label);
  return f ? f.value : null;
}

/**
 * Get the value array from a Tally Matrix block by the block's label.
 * Tally sends Matrix responses as:
 *   { label: 'NATSAL-SW', type: 'MATRIX', value: [{ label: 'row text', value: 'Agree' }, ...] }
 */
function getMatrixRows(fields, blockLabel) {
  const f = fields.find(f => f.label === blockLabel);
  if (!f || !Array.isArray(f.value)) return [];
  return f.value;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreNatsal(fields) {
  const rows = getMatrixRows(fields, MATRIX_LABEL_NATSAL);
  if (rows.length === 0) return { mean: null, category: null, itemsAnswered: 0 };

  const scores = [];
  for (const item of NATSAL_ITEMS) {
    const row = rows.find(r => r.label === item.text);
    if (!row || !row.value) continue; // skipped (e.g. conditional items 8, 9, 13)
    const raw = LIKERT_5[row.value];
    if (raw === undefined) continue;
    scores.push(item.reverse ? reverseScore(raw) : raw);
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
  const rows = getMatrixRows(fields, MATRIX_LABEL_SSE);
  if (rows.length === 0) return { mean: null, category: null };

  const scores = SSE_ITEMS
    .map(text => {
      const row = rows.find(r => r.label === text);
      if (!row || !row.value) return null;
      return CONFIDENCE_5[row.value] ?? null;
    })
    .filter(s => s !== null);

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
    listIds: [3], // TODO: confirm your Brevo list ID for lead magnet contacts
    attributes: {
      NATSAL_CATEGORY: natsalCategory,
      SSE_CATEGORY:    sseCategory,
      AGE:             demographics.age           || '',
      GENDER:          demographics.gender         || '',
      GENDER_DIVERSE:  demographics.genderDiverse  || '',
      ORIENTATION:     demographics.orientation    || '',
      RELATIONSHIP:    demographics.relationship   || '',
      LOCATION:        demographics.location       || '',
      TOPICS:          Array.isArray(demographics.topics)
                         ? demographics.topics.join(', ')
                         : (demographics.topics || ''),
      REFERRAL:        demographics.referral       || '',
      LEAD_SOURCE:     'Sexual Wellbeing Snapshot',
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

  // 201 = created, 204 = updated — both are success
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Brevo contacts API error ${res.status}: ${text}`);
  }
}

async function sendResultEmail({ email, category }) {
  const pdfLink = PDF_LINKS[category];

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <img src="https://cdn.prod.website-files.com/634b8f3a862a6780aba57bb8/634b926d6668dd1ede85b43f_CRSW_Web_Logo.png"
           alt="Centre for Relational and Sexual Wellbeing"
           style="height: 50px; margin-bottom: 24px;" />
      <p>Thank you for completing the Sexual Wellbeing Snapshot. Your personalised result and resource are ready below.</p>
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
      sender:      { name: 'Centre for Relational and Sexual Wellbeing', email: 'hello@centrersw.com' },
      to:          [{ email }],
      subject:     'Your Sexual Wellbeing Snapshot results',
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

    // Tally sends: { eventId, eventType, createdAt, data: { fields: [...] } }
    if (!payload?.data?.fields) {
      return res.status(400).json({ error: 'Invalid Tally payload' });
    }

    const { fields } = payload.data;

    // Log raw payload in development to verify Matrix field structure
    if (process.env.NODE_ENV !== 'production') {
      console.log('Raw fields:', JSON.stringify(fields, null, 2));
    }

    // Email
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

    // Add/update Brevo contact, then send result email
    await upsertBrevoContact({
      email,
      natsalCategory: natsal.category,
      sseCategory:    sse.category || '',
      demographics,
    });

    await sendResultEmail({ email, category: natsal.category });

    console.log(
      `Snapshot: ${email} → ${natsal.category} (mean ${natsal.mean}, n=${natsal.itemsAnswered}) | SSE: ${sse.category} (mean ${sse.mean})`
    );

    return res.status(200).json({ success: true, category: natsal.category });

  } catch (err) {
    console.error('Snapshot handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
