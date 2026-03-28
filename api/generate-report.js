const FIELD_KEYS = {
  // demographics
  email: "question_LdyWl2",
  age: "question_5d5xpE",
  gender: "question_dYVdkK",
  sexual_orientation: "question_YZyaxJ",
  relationship_status: "question_DVyzZZ",
  relationship_structure: "question_lNZrMv",
  country: "question_RzlPVj",
  diagnosed_conditions_binary: "question_oAQGkx",
  diagnosed_conditions_text: "question_GrylQk",

  // major measures
  attachment: "question_OAyGog",
  personality: "question_VZyJ4y",
  depression: "question_PAyOGe",
  anxiety: "question_EPYWNr",
  ders16: "question_42drpY",
  biss: "question_rlWPkR",

  // relationship
  relationship_happiness: "question_oAQGkP",
  relationship_functioning: "question_GrylQZ",
  relationship_warmth: "question_OAyGoR",

  // sexual self-concept
  sse: "question_VZyJ4g",
  sexflex: "question_PAyOGV",

  // sexual function
  desire_freq: "question_EPYWN4",
  desire_ability: "question_rlWPkN",
  arousal_freq: "question_42drzX",
  arousal_confidence: "question_jB2Pva",
  orgasm_freq: "question_245P7j",
  orgasm_satisfaction: "question_xdBYvr",
  orgasm_ease: "question_ZdyaDo",
  pain_freq: "question_NAyodl",
  pain_severity: "question_qbeVvG",
  sexual_satisfaction: "question_QAyVk7",

  // natsal-sf
  natsal_low_desire: "question_9d5QMQ",
  natsal_low_desire_distress: "question_eBPRve",
  natsal_arousal: "question_WAdz1N",
  natsal_arousal_distress: "question_aBodvB",
  natsal_orgasm: "question_6d5NMk",
  natsal_orgasm_distress: "question_7d5xMZ",
  natsal_pain: "question_blGdvL",
  natsal_pain_distress: "question_Al5vyD",
  natsal_anxiety: "question_BG570Q",
  natsal_anxiety_distress: "question_kYxEvR",
  natsal_disconnection: "question_vNbYK0",
  natsal_disconnection_distress: "question_KMy1k8",
  natsal_desire_mismatch: "question_Ldypkv",
  natsal_desire_mismatch_distress: "question_pL9OvJ",
  natsal_avoidance: "question_1r5V6p",
  natsal_avoidance_distress: "question_MAyRMM",
  natsal_sexuality_distress: "question_J2YzMo",
  natsal_sexuality_distress_level: "question_g5rGvO",
  natsal_negative_impact: "question_ylkYzg",
  natsal_negative_impact_distress: "question_Xey0zg",

  // natsal-sw
  natsal_sw: "question_8d5xM5"
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
  },
  ders5: {
    "Almost never": 1,
    "Sometimes": 2,
    "About half the time": 3,
    "Most of the time": 4,
    "Almost always": 5
  },
  biss6: {
    "Very dissatisfied": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "Very satisfied": 6
  },
  sse5: {
    "Not at all confident": 1,
    "2": 2,
    "Moderately confident": 3,
    "4": 4,
    "Completely confident": 5
  },
  sexflex4: {
    "Seldom or never": 1,
    "Sometimes": 2,
    "Often": 3,
    "Almost always": 4
  },
  desire5: {
    "Never": 1,
    "Rarely": 2,
    "Sometimes": 3,
    "Often": 4,
    "Almost Always": 5,
    "Almost always": 5,
    "Did not apply": null
  },
  desireAbility5: {
    "Very low": 1,
    "Low": 2,
    "Moderate": 3,
    "High": 4,
    "Very high": 5,
    "Did not apply": null
  },
  orgasmEase5: {
    "Extremely difficult": 1,
    "Difficult": 2,
    "Neither easy or difficult": 3,
    "Easy": 4,
    "Extremely easy": 5,
    "Did not apply": null
  },
  satisfaction5: {
    "Very dissatisfied": 1,
    "Very dissatisifed": 1,
    "Dissatisfied": 2,
    "Neutral": 3,
    "Satisfied": 4,
    "Very satisfied": 5,
    "Very satisifed": 5,
    "Did not apply": null
  },
  painFreq5Raw: {
    "Never": 1,
    "Rarely": 2,
    "Sometimes": 3,
    "Often": 4,
    "Almost Always": 5,
    "Did not apply": null
  },
  painSeverity5Raw: {
    "No pain": 1,
    "Mild": 2,
    "Moderate": 3,
    "Severe": 4,
    "Extremely severe": 5,
    "Did not apply": null
  },
  natsalSW5: {
    "Strongly disagree": 1,
    "2": 2,
    "Neither agree nor disagree": 3,
    "4": 4,
    "Strongly agree": 5
  },
  csiHappy6: {
    "Extremely unhappy": 1,
    "Fairly unhappy": 2,
    "A little unhappy": 3,
    "Happy": 4,
    "Very happy": 5,
    "Extremely happy": 6
  },
  csiOften6: {
    "Never": 1,
    "Rarely": 2,
    "Sometimes": 3,
    "Often": 4,
    "Very often": 5,
    "Always": 6
  },
  csiAgree7: {
    "Strongly disagree": 1,
    "Disagree": 2,
    "Somewhat disagree": 3,
    "Neither agree nor disagree": 4,
    "Somewhat agree": 5,
    "Agree": 6,
    "Strongly agree": 7
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
  if (!valid.length) return null;
  return valid.reduce((total, r) => total + r.score, 0) / valid.length;
}

function round2(value) {
  return value == null ? null : Math.round(value * 100) / 100;
}

function reverseFive(score) {
  return score == null ? null : 6 - score;
}

function reverseSix(score) {
  return score == null ? null : 7 - score;
}

function reverseSeven(score) {
  return score == null ? null : 8 - score;
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

function classifyDERS16(score) {
  if (score == null) return null;
  if (score <= 31) return "Generally good emotion regulation";
  if (score <= 45) return "Mild difficulties with emotion regulation";
  if (score <= 59) return "Moderate difficulties with emotion regulation";
  return "Significant difficulties with emotion regulation";
}

function classifyBISS(mean) {
  if (mean == null) return null;
  if (mean <= 2.5) return "Low body satisfaction";
  if (mean <= 4.0) return "Moderate body satisfaction";
  if (mean <= 5.0) return "Good body satisfaction";
  return "High body satisfaction";
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

function classifySimpleFive(mean) {
  if (mean == null) return null;
  if (mean < 2.5) return "Lower";
  if (mean < 3.5) return "Moderate";
  return "Higher";
}

function classifySexFlex(mean) {
  if (mean == null) return null;
  if (mean < 2) return "Low sexual flexibility";
  if (mean < 3) return "Moderate sexual flexibility";
  return "High sexual flexibility";
}

function classifyNatsalSF(score) {
  if (score == null) return null;
  if (score <= 3) return "Good sexual function";
  if (score <= 8) return "Lowered sexual function";
  return "Difficulties in sexual function";
}

function classifyNatsalSW(mean) {
  if (mean == null) return null;
  if (mean < 2.5) return "Lower sexual wellbeing";
  if (mean < 3.5) return "Moderate sexual wellbeing";
  return "Higher sexual wellbeing";
}

function mapByItem(scoredResponses) {
  const out = {};
  for (const row of scoredResponses) out[row.item] = row.score;
  return out;
}

function scoreSingleChoice(field, map) {
  const text = getSelectedOptionText(field);
  return text == null ? null : map[text] ?? null;
}

function scoreNatsalProblem(yesNoField, distressField) {
  const yesNo = getSelectedOptionText(yesNoField);
  if (yesNo === "No") return 0;
  if (yesNo !== "Yes") return null;

  const distress = getSelectedOptionText(distressField);
  if (distress === "Not distressing") return 1;
  if (distress === "A little distressing") return 2;
  if (distress === "Quite distressing") return 3;
  if (distress === "Very distressing") return 4;
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
try {
  const fields = req.body?.data?.fields;

  console.log("ALL FIELDS:", JSON.stringify(fields, null, 2));  // ✅ move here

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

    // ---------- Core matrices ----------
    const scoredAttachment = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.attachment)),
      RESPONSE_MAPS.ecr7
    );

    const scoredPersonality = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.personality)),
      RESPONSE_MAPS.bfi5
    );

    const scoredDepression = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.depression)),
      RESPONSE_MAPS.phq4
    );

    const scoredAnxiety = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.anxiety)),
      RESPONSE_MAPS.gad4
    );

    const scoredDERS = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.ders16)),
      RESPONSE_MAPS.ders5
    );

    const scoredBISS = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.biss)),
      RESPONSE_MAPS.biss6
    );

    // ---------- ECR ----------
    const attachmentMap = mapByItem(scoredAttachment);

    const avoidanceItems = [
      "I prefer not to show a partner how I feel deep down",
      "I am very uncomfortable being close to romantic partners",
      "Just when my partner starts to get close to me, I find myself pulling away",
      "I want to get close to my partner, but I keep pulling back",
      "I dont feel comfortable opening up to romantic partners",
      "I don't feel comfortable opening up to romantic partners",
      "I want to be close to my partner, but something always seems to stop me"
    ];

    const anxietyItems = [
      "I worry about being abandoned by my partner",
      "I worry a lot about my relationships",
      "I worry that romantic partners wont care about me as much as I care about them",
      "I worry that romantic partners won't care about me as much as I care about them",
      "I worry a lot about losing my partner",
      "I often wish that my partners feelings for me were as strong as my feelings for them",
      "I often wish that my partner's feelings for me were as strong as my feelings for them",
      "I find that my partner(s) dont want to get as close as I would like",
      "I find that my partner(s) don't want to get as close as I would like"
    ];

    const ecrAvoidanceScores = avoidanceItems.map((item) => attachmentMap[item]).filter((v) => v != null);
    const ecrAnxietyScores = anxietyItems.map((item) => attachmentMap[item]).filter((v) => v != null);

    const ecrAvoidanceTotal = ecrAvoidanceScores.reduce((a, b) => a + b, 0);
    const ecrAnxietyTotal = ecrAnxietyScores.reduce((a, b) => a + b, 0);
    const ecrAvoidanceMean = ecrAvoidanceScores.length ? ecrAvoidanceTotal / ecrAvoidanceScores.length : null;
    const ecrAnxietyMean = ecrAnxietyScores.length ? ecrAnxietyTotal / ecrAnxietyScores.length : null;

    const attachment = {
      anxiety_total: ecrAnxietyTotal,
      anxiety_mean: round2(ecrAnxietyMean),
      avoidance_total: ecrAvoidanceTotal,
      avoidance_mean: round2(ecrAvoidanceMean),
      profile: classifyECRProfile(ecrAnxietyMean, ecrAvoidanceMean)
    };

    // ---------- BFI ----------
    const personalityMap = mapByItem(scoredPersonality);

    const personality = {
      extraversion: round2(meanScores([
        { score: reverseFive(personalityMap["I see myself as someone who is reserved"]) },
        { score: personalityMap["I see myself as someone who is outgoing, sociable"] }
      ])),
      agreeableness: round2(meanScores([
        { score: personalityMap["I see myself as someone who is generally trusting"] },
        { score: reverseFive(personalityMap["I see myself as someone who tends to find fault with others"]) }
      ])),
      conscientiousness: round2(meanScores([
        { score: reverseFive(personalityMap["I see myself as someone who tends to be lazy"]) },
        { score: personalityMap["I see myself as someone who does a thorough job"] }
      ])),
      neuroticism: round2(meanScores([
        { score: reverseFive(personalityMap["I see myself as someone who is relaxed, handles stress well"]) },
        { score: personalityMap["I see myself as someone who gets nervous easily"] }
      ])),
      openness: round2(meanScores([
        { score: reverseFive(personalityMap["I see myself as someone who has few artistic interests"]) },
        { score: personalityMap["I see myself as someone who has an active imagination"] }
      ]))
    };

    personality.extraversion_label = classifyBFITrait(personality.extraversion);
    personality.agreeableness_label = classifyBFITrait(personality.agreeableness);
    personality.conscientiousness_label = classifyBFITrait(personality.conscientiousness);
    personality.neuroticism_label = classifyBFITrait(personality.neuroticism);
    personality.openness_label = classifyBFITrait(personality.openness);

    // ---------- PHQ / GAD ----------
    const depressionScore = sumScores(scoredDepression);
    const anxietyScore = sumScores(scoredAnxiety);

    const mental_health = {
      depression: {
        score: depressionScore,
        label: classifyPHQ8(depressionScore)
      },
      anxiety: {
        score: anxietyScore,
        label: classifyGAD7(anxietyScore)
      }
    };

    // ---------- DERS ----------
    const dersMap = mapByItem(scoredDERS);

    const dersReverseItems = [
      "I am clear about my feelings",
      "I pay attention to how I feel",
      "I am attentive to my feelings",
      "I know exactly how I am feeling",
      "I care about what I am feeling",
      "When Im upset, I acknowledge my emotions",
      "When I'm upset, I acknowledge my emotions"
    ];

    const dersTotal = scoredDERS.reduce((total, row) => {
      let score = row.score;
      if (dersReverseItems.includes(row.item)) {
        score = reverseFive(score);
      }
      return total + (score ?? 0);
    }, 0);

    const emotion_regulation = {
      score: dersTotal,
      label: classifyDERS16(dersTotal)
    };

    // ---------- BISS ----------
    const bissMean = meanScores(scoredBISS);
    const body_image = {
      mean: round2(bissMean),
      label: classifyBISS(bissMean)
    };

    // ---------- CSI ----------
    let relationship = {
      score: null,
      label: "Not applicable"
    };

    if (relationshipStatus === "Yes, I am currently in a relationship") {
      const csiHappy = scoreSingleChoice(
        getField(fields, FIELD_KEYS.relationship_happiness),
        RESPONSE_MAPS.csiHappy6
      );
      const csiFunctioning = scoreSingleChoice(
        getField(fields, FIELD_KEYS.relationship_functioning),
        RESPONSE_MAPS.csiOften6
      );
      const csiWarmth = scoreSingleChoice(
        getField(fields, FIELD_KEYS.relationship_warmth),
        RESPONSE_MAPS.csiAgree7
      );

      const csiScores = [csiHappy, csiFunctioning, csiWarmth].filter((v) => v != null);
      const csiMean = csiScores.length ? csiScores.reduce((a, b) => a + b, 0) / csiScores.length : null;

      relationship = {
        score: round2(csiMean),
        label: csiMean == null ? "Not applicable" : classifySimpleFive((csiMean / 7) * 5)
      };
    }

    // ---------- SSE ----------
    const scoredSSE = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.sse)),
      RESPONSE_MAPS.sse5
    );
    const sseMean = meanScores(scoredSSE);
    const sexual_self_efficacy = {
      mean: round2(sseMean),
      label: classifySimpleFive(sseMean)
    };

    // ---------- SexFlex ----------
    const scoredSexFlex = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.sexflex)),
      RESPONSE_MAPS.sexflex4
    );
    const sexFlexMean = meanScores(scoredSexFlex);
    const sexual_flexibility = {
      mean: round2(sexFlexMean),
      label: classifySexFlex(sexFlexMean)
    };

    // ---------- Sexual function ----------
    const desireMean = meanScores([
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.desire_freq)),
        RESPONSE_MAPS.desire5
      ),
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.desire_ability)),
        RESPONSE_MAPS.desireAbility5
      )
    ]);

    const arousalMean = meanScores([
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.arousal_freq)),
        RESPONSE_MAPS.desire5
      ),
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.arousal_confidence)),
        RESPONSE_MAPS.sse5
      )
    ]);

    const orgasmMean = meanScores([
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.orgasm_freq)),
        RESPONSE_MAPS.desire5
      ),
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.orgasm_satisfaction)),
        RESPONSE_MAPS.satisfaction5
      ),
      ...scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.orgasm_ease)),
        RESPONSE_MAPS.orgasmEase5
      )
    ]);

    const painFreqScores = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.pain_freq)),
      RESPONSE_MAPS.painFreq5Raw
    ).map((r) => ({ ...r, score: r.score == null ? null : 6 - r.score }));

    const painSeverityScores = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.pain_severity)),
      RESPONSE_MAPS.painSeverity5Raw
    ).map((r) => ({ ...r, score: r.score == null ? null : 6 - r.score }));

    const painMean = meanScores([...painFreqScores, ...painSeverityScores]);

    const satisfactionMean = meanScores(
      scoreResponses(
        parseMatrixResponses(getField(fields, FIELD_KEYS.sexual_satisfaction)),
        RESPONSE_MAPS.satisfaction5
      )
    );

    const sexual_function = {
      desire: { mean: round2(desireMean), label: classifySimpleFive(desireMean) },
      arousal: { mean: round2(arousalMean), label: classifySimpleFive(arousalMean) },
      orgasm: { mean: round2(orgasmMean), label: classifySimpleFive(orgasmMean) },
      pain: { mean: round2(painMean), label: classifySimpleFive(painMean) },
      satisfaction: { mean: round2(satisfactionMean), label: classifySimpleFive(satisfactionMean) }
    };

    // ---------- NATSAL-SF ----------
    const natsalSfItemScores = {
      low_desire: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_low_desire),
        getField(fields, FIELD_KEYS.natsal_low_desire_distress)
      ),
      arousal: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_arousal),
        getField(fields, FIELD_KEYS.natsal_arousal_distress)
      ),
      orgasm: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_orgasm),
        getField(fields, FIELD_KEYS.natsal_orgasm_distress)
      ),
      pain: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_pain),
        getField(fields, FIELD_KEYS.natsal_pain_distress)
      ),
      anxiety: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_anxiety),
        getField(fields, FIELD_KEYS.natsal_anxiety_distress)
      ),
      disconnection: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_disconnection),
        getField(fields, FIELD_KEYS.natsal_disconnection_distress)
      ),
      desire_mismatch: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_desire_mismatch),
        getField(fields, FIELD_KEYS.natsal_desire_mismatch_distress)
      ),
      avoidance: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_avoidance),
        getField(fields, FIELD_KEYS.natsal_avoidance_distress)
      ),
      sexuality_distress: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_sexuality_distress),
        getField(fields, FIELD_KEYS.natsal_sexuality_distress_level)
      ),
      negative_impact: scoreNatsalProblem(
        getField(fields, FIELD_KEYS.natsal_negative_impact),
        getField(fields, FIELD_KEYS.natsal_negative_impact_distress)
      )
    };

    const natsalSfTotal = Object.values(natsalSfItemScores)
      .filter((v) => v != null)
      .reduce((a, b) => a + b, 0);

    const natsal_sf = {
      score: natsalSfTotal,
      label: classifyNatsalSF(natsalSfTotal),
      items: natsalSfItemScores
    };

    // ---------- NATSAL-SW ----------
    const scoredNatsalSW = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.natsal_sw)),
      RESPONSE_MAPS.natsalSW5
    );

    const natsalSwMean = meanScores(scoredNatsalSW);

    const natsal_sw = {
      mean: round2(natsalSwMean),
      label: classifyNatsalSW(natsalSwMean)
    };

    const results = {
      demographics,
      attachment,
      personality,
      mental_health,
      emotion_regulation,
      body_image,
      relationship,
      sexual_self_efficacy,
      sexual_flexibility,
      sexual_function,
      natsal_sf,
      natsal_sw
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
