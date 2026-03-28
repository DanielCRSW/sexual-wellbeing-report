const FIELD_KEYS = {
  email: "question_LdyWl2",
  age: "question_5d5xpE",
  gender: "question_dYVdkK",
  sexual_orientation: "question_YZyaxJ",
  relationship_status: "question_DVyzZZ",
  relationship_structure: "question_lNZrMv",
  country: "question_RzlPVj",
  diagnosed_conditions_binary: "question_oAQGkx",
  diagnosed_conditions_text: "question_GrylQk",

  attachment: "question_OAyGog",
  personality: "question_VZyJ4y",
  depression: "question_PAyOGe",
  anxiety: "question_EPYWNr"
};

const getField = (fields, key) =>
  fields.find((f) => f.key === key);

const getSelectedOptionText = (field) => {
  if (!field || !field.value || !field.options) return null;
  const selectedId = Array.isArray(field.value) ? field.value[0] : field.value;
  const selectedOption = field.options.find((opt) => opt.id === selectedId);
  return selectedOption ? selectedOption.text : null;
};

const parseMatrixResponses = (field) => {
  if (!field || !field.rows || !field.columns || !field.value) return [];

  return field.rows.map((row) => {
    const selectedColumnId = field.value[row.id]?.[0] ?? null;
    const selectedColumn = field.columns.find((col) => col.id === selectedColumnId);

    return {
      item: row.text,
      response: selectedColumn ? selectedColumn.text : null
    };
  });
};

const RESPONSE_MAPS = {
  ecr7: {
    "Strongly disagree": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "Strongly agree": 7
  },
  bfi5: {
    "Strongly disagree": 1,
    "2": 2,
    "Neutral": 3,
    "4": 4,
    "Strongly agree": 5
  },
  phq4: {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  },
  gad4: {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  }
};

const scoreResponses = (responses, map) => {
  return responses.map((r) => ({
    item: r.item,
    response: r.response,
    score: map[r.response] ?? null
  }));
};

const sumScores = (responses) =>
  responses.reduce((total, r) => total + (r.score ?? 0), 0);

const meanScore = (responses) => {
  const valid = responses.filter(r => r.score !== null);
  if (valid.length === 0) return null;
  return valid.reduce((sum, r) => sum + r.score, 0) / valid.length;
};

export default async function handler(req, res) {
  try {
    const fields = req.body.data.fields;

    // =====================
    // BASIC INFO
    // =====================
    const output = {
      email: getField(fields, FIELD_KEYS.email)?.value ?? null,
      age: getField(fields, FIELD_KEYS.age)?.value ?? null,
      gender: getSelectedOptionText(getField(fields, FIELD_KEYS.gender)),
      sexual_orientation: getSelectedOptionText(getField(fields, FIELD_KEYS.sexual_orientation)),
      relationship_status: getSelectedOptionText(getField(fields, FIELD_KEYS.relationship_status)),
      relationship_structure: getSelectedOptionText(getField(fields, FIELD_KEYS.relationship_structure)),
      country: getField(fields, FIELD_KEYS.country)?.value ?? null,
      diagnosed_conditions_binary: getSelectedOptionText(getField(fields, FIELD_KEYS.diagnosed_conditions_binary)),
      diagnosed_conditions_text: getField(fields, FIELD_KEYS.diagnosed_conditions_text)?.value ?? null
    };

    // =====================
    // PARSE RESPONSES
    // =====================
    const attachmentResponses = parseMatrixResponses(
      getField(fields, FIELD_KEYS.attachment)
    );

    const personalityResponses = parseMatrixResponses(
      getField(fields, FIELD_KEYS.personality)
    );

    const depressionResponses = parseMatrixResponses(
      getField(fields, FIELD_KEYS.depression)
    );

    const anxietyResponses = parseMatrixResponses(
      getField(fields, FIELD_KEYS.anxiety)
    );

    // =====================
    // SCORE RESPONSES
    // =====================
    const scoredAttachment = scoreResponses(attachmentResponses, RESPONSE_MAPS.ecr7);
    const scoredPersonality = scoreResponses(personalityResponses, RESPONSE_MAPS.bfi5);
    const scoredDepression = scoreResponses(depressionResponses, RESPONSE_MAPS.phq4);
    const scoredAnxiety = scoreResponses(anxietyResponses, RESPONSE_MAPS.gad4);

    const attachmentTotal = sumScores(scoredAttachment);
    const personalityMean = meanScore(scoredPersonality);
    const depressionTotal = sumScores(scoredDepression);
    const anxietyTotal = sumScores(scoredAnxiety);

    // =====================
    // CLASSIFICATION LOGIC
    // =====================
    const classifyDepression = (score) => {
      if (score <= 4) return "minimal";
      if (score <= 9) return "mild";
      if (score <= 14) return "moderate";
      return "severe";
    };

    const classifyAnxiety = (score) => {
      if (score <= 4) return "minimal";
      if (score <= 9) return "mild";
      if (score <= 14) return "moderate";
      return "severe";
    };

    const classifyAttachment = (mean) => {
      if (mean === null) return "unknown";
      if (mean > 4.5) return "insecure pattern";
      return "generally secure pattern";
    };

    // =====================
    // FINAL OBJECT
    // =====================
    const results = {
      demographics: output,

      attachment: {
        total: attachmentTotal,
        mean: meanScore(scoredAttachment),
        profile: classifyAttachment(meanScore(scoredAttachment))
      },

      personality: {
        mean: personalityMean
      },

      mental_health: {
        depression: {
          score: depressionTotal,
          severity: classifyDepression(depressionTotal)
        },
        anxiety: {
          score: anxietyTotal,
          severity: classifyAnxiety(anxietyTotal)
        }
      }
    };

    console.log("FINAL REPORT DEBUG:", JSON.stringify(results, null, 2));

    return res.status(200).json(results);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
}
