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

function getField(fields, key) {
  return fields.find((f) => f.key === key);
}

function cleanText(value) {
  if (value == null) return null;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getSelectedOptionText(field) {
  if (!field || field.value == null || !field.options) return null;

  const selectedId = Array.isArray(field.value) ? field.value[0] : field.value;
  const selectedOption = field.options.find((opt) => opt.id === selectedId);

  return selectedOption ? cleanText(selectedOption.text) : null;
}

function parseMatrixResponses(field) {
  if (!field || !field.rows || !field.columns || !field.value) return [];

  return field.rows.map((row) => {
    const selectedColumnId = field.value[row.id]?.[0] ?? null;
    const selectedColumn = field.columns.find((col) => col.id === selectedColumnId);

    return {
      item: cleanText(row.text),
      response: selectedColumn ? cleanText(selectedColumn.text) : null
    };
  });
}

function scoreResponses(responses, map) {
  return responses.map((r) => ({
    item: r.item,
    response: r.response,
    score: map[r.response] ?? null
  }));
}

function sumScores(responses) {
  return responses.reduce((total, r) => total + (r.score ?? 0), 0);
}

function meanScores(responses) {
  const valid = responses.filter((r) => r.score !== null);
  if (valid.length === 0) return null;
  return valid.reduce((total, r) => total + r.score, 0) / valid.length;
}

function round2(value) {
  return value == null ? null : Math.round(value * 100) / 100;
}

function reverseFive(score) {
  if (score == null) return null;
  return 6 - score;
}

function classifyPHQ8(score) {
  if (score == null) return null;
  if (score <= 4) return "Minimal depressive symptoms";
  if (score <= 9) return "Mild depressive symptoms";
  if (score <= 14) return "Moderate depressive symptoms";
  if (score <= 19) return "Moderately severe depressive symptoms";
  return "Severe depressive symptoms";
}

function classifyGAD7(score) {
  if (score == null) return null;
  if (score <= 4) return "Minimal anxiety symptoms";
  if (score <= 9) return "Mild anxiety symptoms";
  if (score <= 14) return "Moderate anxiety symptoms";
  return "Severe anxiety symptoms";
}

function classifyBFITrait(mean) {
  if (mean == null) return null;
  if (mean < 2.5) return "Low";
  if (mean < 3.5) return "Moderate";
  return "High";
}

function classifyECRProfile(anxietyMean, avoidanceMean) {
  if (anxietyMean == null || avoidanceMean == null) return null;

  const highAnxiety = anxietyMean >= 4;
  const highAvoidance = avoidanceMean >= 4;

  if (!highAnxiety && !highAvoidance) return "Secure";
  if (highAnxiety && !highAvoidance) return "Anxious";
  if (!highAnxiety && highAvoidance) return "Avoidant";
  return "Fearful";
}

function mapByItem(scoredResponses) {
  const out = {};
  for (const row of scoredResponses) {
    out[row.item] = row.score;
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const fields = req.body?.data?.fields;
    if (!Array.isArray(fields)) {
      return res.status(400).json({ error: "No fields found" });
    }

    const relationshipStatus = getSelectedOptionText(getField(fields, FIELD_KEYS.relationship_status));
    const diagnosedConditionsBinary = getSelectedOptionText(
      getField(fields, FIELD_KEYS.diagnosed_conditions_binary)
    );

    const demographics = {
      email: cleanText(getField(fields, FIELD_KEYS.email)?.value) ?? null,
      age: getField(fields, FIELD_KEYS.age)?.value ?? null,
      gender: getSelectedOptionText(getField(fields, FIELD_KEYS.gender)),
      sexual_orientation: getSelectedOptionText(getField(fields, FIELD_KEYS.sexual_orientation)),
      relationship_status: relationshipStatus,
      relationship_structure:
        relationshipStatus === "Yes, I am currently in a relationship"
          ? getSelectedOptionText(getField(fields, FIELD_KEYS.relationship_structure))
          : null,
      country: cleanText(getField(fields, FIELD_KEYS.country)?.value) ?? null,
      diagnosed_conditions_binary: diagnosedConditionsBinary,
      diagnosed_conditions_text:
        diagnosedConditionsBinary === "Yes"
          ? cleanText(getField(fields, FIELD_KEYS.diagnosed_conditions_text)?.value)
          : null
    };

    // Parse matrices
    const attachmentResponses = parseMatrixResponses(getField(fields, FIELD_KEYS.attachment));
    const personalityResponses = parseMatrixResponses(getField(fields, FIELD_KEYS.personality));
    const depressionResponses = parseMatrixResponses(getField(fields, FIELD_KEYS.depression));
    const anxietyResponses = parseMatrixResponses(getField(fields, FIELD_KEYS.anxiety));

    // Score matrices
    const scoredAttachment = scoreResponses(attachmentResponses, RESPONSE_MAPS.ecr7);
    const scoredPersonality = scoreResponses(personalityResponses, RESPONSE_MAPS.bfi5);
    const scoredDepression = scoreResponses(depressionResponses, RESPONSE_MAPS.phq4);
    const scoredAnxiety = scoreResponses(anxietyResponses, RESPONSE_MAPS.gad4);

    // ---------- ECR-12 ----------
    const attachmentMap = mapByItem(scoredAttachment);

    const avoidanceItems = [
      "I prefer not to show a partner how I feel deep down",
      "I am very uncomfortable being close to romantic partners",
      "Just when my partner starts to get close to me, I find myself pulling away",
      "I want to get close to my partner, but I keep pulling back",
      "I don't feel comfortable opening up to romantic partners",
      "I want to be close to my partner, but something always seems to stop me"
    ];

    const anxietyItems = [
      "I worry about being abandoned by my partner",
      "I worry a lot about my relationships",
      "I worry that romantic partners won't care about me as much as I care about them",
      "I worry a lot about losing my partner",
      "I often wish that my partner's feelings for me were as strong as my feelings for them",
      "I find that my partner(s) don't want to get as close as I would like"
    ];

    const ecrAvoidanceScores = avoidanceItems
      .map((item) => attachmentMap[item] ?? null)
      .filter((v) => v !== null);

    const ecrAnxietyScores = anxietyItems
      .map((item) => attachmentMap[item] ?? null)
      .filter((v) => v !== null);

    const ecrAvoidanceTotal = ecrAvoidanceScores.reduce((a, b) => a + b, 0);
    const ecrAnxietyTotal = ecrAnxietyScores.reduce((a, b) => a + b, 0);

    const ecrAvoidanceMean =
      ecrAvoidanceScores.length ? ecrAvoidanceTotal / ecrAvoidanceScores.length : null;
    const ecrAnxietyMean =
      ecrAnxietyScores.length ? ecrAnxietyTotal / ecrAnxietyScores.length : null;

    const ecrProfile = classifyECRProfile(ecrAnxietyMean, ecrAvoidanceMean);

    // ---------- BFI-10 ----------
    const personalityMap = mapByItem(scoredPersonality);

    const bfi = {
      extraversion: round2(
        meanScores([
          { score: reverseFive(personalityMap["I see myself as someone who is reserved"]) },
          { score: personalityMap["I see myself as someone who is outgoing, sociable"] }
        ])
      ),
      agreeableness: round2(
        meanScores([
          { score: personalityMap["I see myself as someone who is generally trusting"] },
          { score: reverseFive(personalityMap["I see myself as someone who tends to find fault with others"]) }
        ])
      ),
      conscientiousness: round2(
        meanScores([
          { score: reverseFive(personalityMap["I see myself as someone who tends to be lazy"]) },
          { score: personalityMap["I see myself as someone who does a thorough job"] }
        ])
      ),
      neuroticism: round2(
        meanScores([
          { score: reverseFive(personalityMap["I see myself as someone who is relaxed, handles stress well"]) },
          { score: personalityMap["I see myself as someone who gets nervous easily"] }
        ])
      ),
      openness: round2(
        meanScores([
          { score: reverseFive(personalityMap["I see myself as someone who has few artistic interests"]) },
          { score: personalityMap["I see myself as someone who has an active imagination"] }
        ])
      )
    };

    const bfiProfile = {
      extraversion_label: classifyBFITrait(bfi.extraversion),
      agreeableness_label: classifyBFITrait(bfi.agreeableness),
      conscientiousness_label: classifyBFITrait(bfi.conscientiousness),
      neuroticism_label: classifyBFITrait(bfi.neuroticism),
      openness_label: classifyBFITrait(bfi.openness)
    };

    // ---------- PHQ-8 / GAD-7 ----------
    const phq8Score = sumScores(scoredDepression);
    const gad7Score = sumScores(scoredAnxiety);

    const mentalHealth = {
      depression: {
        score: phq8Score,
        label: classifyPHQ8(phq8Score)
      },
      anxiety: {
        score: gad7Score,
        label: classifyGAD7(gad7Score)
      }
    };

    const results = {
      demographics,
      attachment: {
        anxiety_total: ecrAnxietyTotal,
        anxiety_mean: round2(ecrAnxietyMean),
        avoidance_total: ecrAvoidanceTotal,
        avoidance_mean: round2(ecrAvoidanceMean),
        profile: ecrProfile
      },
      personality: {
        ...bfi,
        ...bfiProfile
      },
      mental_health: mentalHealth
    };

    console.log("FINAL REPORT DEBUG:", JSON.stringify(results, null, 2));
    return res.status(200).json(results);
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return res.status(500).json({
      error: "Failed",
      message: error.message
    });
  }
}
