const FIELD_KEYS = {
  // demographics
  email: "question_LdyWl2",
  age: "question_5d5xpE",
  gender: "question_dYVdkK",
  sexual_orientation: "question_YZyaxJ",
  relationship_status: "question_DVyzZZ",
  relationship_structure: "question_lNZrMv",
  country: "question_RzlPVj",

  // health
  diagnosed_conditions_binary: "question_oAQGkx",
  diagnosed_conditions_text: "question_GrylQk",

  // attachment
  attachment: "question_OAyGog",

  // personality
  personality: "question_VZyJ4y",

  // depression
  depression: "question_PAyOGe",

  // anxiety
  anxiety: "question_EPYWNr",

  // relationship quality
  relationship_happiness: "question_oAQGkP",
  relationship_functioning: "question_GrylQZ",
  relationship_warmth: "question_OAyGoR",

  // sexual functioning domains
  sexual_desire: "question_EPYWN4",
  sexual_arousal: "question_42drzX",
  orgasm: "question_245P7j",
  physical_pain: "question_NAyodl",
  sexual_satisfaction: "question_QAyVk7"
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

export default async function handler(req, res) {
  try {
    const fields = req.body.data.fields;

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

    const scoredAttachment = scoreResponses(attachmentResponses, RESPONSE_MAPS.ecr7);
    const scoredPersonality = scoreResponses(personalityResponses, RESPONSE_MAPS.bfi5);
    const scoredDepression = scoreResponses(depressionResponses, RESPONSE_MAPS.phq4);
    const scoredAnxiety = scoreResponses(anxietyResponses, RESPONSE_MAPS.gad4);

    const attachmentTotal = sumScores(scoredAttachment);
    const personalityTotal = sumScores(scoredPersonality);
    const depressionTotal = sumScores(scoredDepression);
    const anxietyTotal = sumScores(scoredAnxiety);

    console.log("TOTALS:", JSON.stringify({
      attachmentTotal,
      personalityTotal,
      depressionTotal,
      anxietyTotal
    }, null, 2));

    return res.status(200).json({
      output,
      totals: {
        attachmentTotal,
        personalityTotal,
        depressionTotal,
        anxietyTotal
      }
    });

    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
}
