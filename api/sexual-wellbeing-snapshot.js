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

const MATRIX_LABEL_NATSAL = 'NATSAL-SW';
const MATRIX_LABEL_SSE    = 'SSE';

// ─── NATSAL-SW item definitions ───────────────────────────────────────────────
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

function reverseScore(score) { return 6 - score; }

function classifyNatsal(mean) {
  if (mean < 3)  return 'Lower';
  if (mean <= 4) return 'Moderate';
  return 'Higher';
}

function classifySSE(mean) {
  if (mean < 3)  return 'lower';
  if (mean <= 4) return 'moderate';
  return 'higher';
}

/**
 * Get a field from Tally's fields array by its label.
 * Resolves dropdown and checkbox option IDs to their text values automatically.
 * Tally format: { key, label, type, value, options?, rows?, columns? }
 *
 * Matrix fields value format: { rowId: [colId], ... }
 * Dropdown value format:      [optionId]
 * Checkboxes value format:    [optionId, ...]
 */
function getField(fields, label) {
  const f = fields.find(f => f.label === label);
  if (!f) return null;

  // Dropdown — resolve selected option ID(s) to text
  if (f.type === 'DROPDOWN' && Array.isArray(f.value) && f.options) {
    const texts = f.value
      .map(id => f.options.find(o => o.id === id)?.text)
      .filter(Boolean);
    return texts.length === 1 ? texts[0] : texts;
  }

  // Checkboxes — resolve selected option ID(s) to text array
  if (f.type === 'CHECKBOXES' && Array.isArray(f.value) && f.options) {
    return f.value
      .map(id => f.options.find(o => o.id === id)?.text)
      .filter(Boolean);
  }

  return f.value;
}

/**
 * Build a { rowText → columnText } map from a Tally Matrix field.
 * Tally sends: value = { rowId: [colId] }, rows = [{id, text}], columns = [{id, text}]
 */
function buildMatrixMap(matrixField) {
  const map = {};
  if (!matrixField || typeof matrixField.value !== 'object' || Array.isArray(matrixField.value)) return map;
  for (const [rowId, colIds] of Object.entries(matrixField.value)) {
    const row = matrixField.rows?.find(r => r.id === rowId);
    const col = matrixField.columns?.find(c => c.id === colIds[0]);
    if (row && col) map[row.text] = col.text;
  }
  return map;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreNatsal(fields) {
  const f = fields.find(f => f.label === MATRIX_LABEL_NATSAL && f.type === 'MATRIX');
  if (!f) return { mean: null, category: null, itemsAnswered: 0 };

  const rowMap = buildMatrixMap(f);
  const scores = [];

  for (const item of NATSAL_ITEMS) {
    const colText = rowMap[item.text];
    if (!colText) continue;
    const raw = LIKERT_5[colText];
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
  const f = fields.find(f => f.label === MATRIX_LABEL_SSE && f.type === 'MATRIX');
  if (!f) return { mean: null, category: null };

  const rowMap = buildMatrixMap(f);
  const scores = SSE_ITEMS
    .map(text => {
      const colText = rowMap[text];
      if (!colText) return null;
      return CONFIDENCE_5[colText] ?? null;
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
    listIds: [5],
    attributes: {
      NATSAL_CATEGORY: natsalCategory,
      SSE_CATEGORY:    sseCategory,
      AGE:             demographics.age          || '',
      GENDER:          demographics.gender        || '',
      GENDER_DIVERSE:  demographics.genderDiverse || '',
      ORIENTATION:     demographics.orientation   || '',
      RELATIONSHIP:    demographics.relationship  || '',
      LOCATION:        demographics.location      || '',
      TOPICS:          Array.isArray(demographics.topics)
                         ? demographics.topics.join(', ')
                         : (demographics.topics   || ''),
      REFERRAL:        Array.isArray(demographics.referral)
                         ? demographics.referral.join(', ')
                         : (demographics.referral || ''),
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

    if (!payload?.data?.fields) {
      return res.status(400).json({ error: 'Invalid Tally payload' });
    }

    const { fields } = payload.data;

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
      console.error('Fields received:', JSON.stringify(fields.map(f => ({ label: f.label, type: f.type })), null, 2));
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

    // Add contact to Brevo — non-fatal if it fails (e.g. IP restriction)
    try {
      await upsertBrevoContact({
        email,
        natsalCategory: natsal.category,
        sseCategory:    sse.category || '',
        demographics,
      });
    } catch (brevoErr) {
      console.error('Brevo contact upsert failed (non-fatal):', brevoErr.message);
    }

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
