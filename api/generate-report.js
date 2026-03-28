// api/generate-report.js

const FIELD_KEYS = {
  // personalisation
  name: "question_vBevlX",

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

  // WHOQOL
  whoqol_physical_1: "question_jB2Pk4",
  whoqol_physical_2: "question_245PD9",
  whoqol_env_1: "question_xdBYl5",
  whoqol_env_2: "question_RzlPV9",

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

  // NATSAL-SF
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

  // NATSAL-SW
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
  },
  whoqol5: {
    "Not at all": 1,
    "A little": 2,
    "Moderately": 3,
    "Mostly": 4,
    "Completely": 5,
    "Very dissatisfied": 1,
    "Dissatisfied": 2,
    "Neither satisfied nor dissatisfied": 3,
    "Satisfied": 4,
    "Very satisfied": 5
  }
};

const WHOQOL_TEXT = {
  physical: {
    Poor: "Your responses suggest your physical health is significantly affecting your quality of life. Pain, low energy, sleep difficulties, or reduced day-to-day functioning may be having a meaningful impact.",
    Fair: "Your responses suggest your physical health is having a moderate impact on your quality of life. Some difficulties may be noticeable at times, even if they are not overwhelming.",
    Good: "Your responses suggest your physical health is generally good and not significantly interfering with daily life. Physical concerns do not appear to be creating major limitations most days.",
    "Very Good": "Your responses suggest your physical health is a strength in your overall profile. Physical concerns do not appear to be significantly affecting your day-to-day functioning at this time."
  },
  environment: {
    Poor: "Your responses suggest your environment is significantly affecting your quality of life. Factors such as safety, resources, services, or living conditions may be placing strain on wellbeing.",
    Fair: "Your responses suggest your environment is having a moderate impact on your quality of life. Some parts of your living situation or access to resources may be creating stress or limitation.",
    Good: "Your responses suggest your environment is generally supportive. Your living situation, access to resources, and broader environment do not appear to be creating major barriers.",
    "Very Good": "Your responses suggest your environment is a strength in your overall profile. You appear to have good access to resources and a stable, supportive practical environment."
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

function round2(value) {
  return value == null ? null : Math.round(value * 100) / 100;
}

function round0(value) {
  return value == null ? null : Math.round(value);
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

function reverseFive(score) {
  return score == null ? null : 6 - score;
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

function interpretWHOQOL(score) {
  if (score == null) return null;
  if (score <= 40) return "Poor";
  if (score <= 60) return "Fair";
  if (score <= 80) return "Good";
  return "Very Good";
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

function scoreWHOQOLItems(responses, reverseIndices = []) {
  return responses
    .map((r, i) => {
      let score = RESPONSE_MAPS.whoqol5[r.response] ?? null;
      if (reverseIndices.includes(i)) score = reverseFive(score);
      return { ...r, score };
    })
    .filter((r) => r.score != null);
}

function buildBFIParagraph(personality) {
  const bits = [
    personality.extraversion_label ? `Extraversion appears ${personality.extraversion_label.toLowerCase()}` : null,
    personality.agreeableness_label ? `agreeableness appears ${personality.agreeableness_label.toLowerCase()}` : null,
    personality.conscientiousness_label ? `conscientiousness appears ${personality.conscientiousness_label.toLowerCase()}` : null,
    personality.neuroticism_label ? `emotional reactivity appears ${personality.neuroticism_label.toLowerCase()}` : null,
    personality.openness_label ? `openness appears ${personality.openness_label.toLowerCase()}` : null
  ].filter(Boolean);

  if (!bits.length) return null;
  return bits.join(", ") + ".";
}

function nonEmptyOrNull(value) {
  const cleaned = cleanText(value);
  return cleaned ? cleaned : null;
}

function buildPromptFields(reportFields) {
  return `
Name: ${reportFields.name ?? "Not provided"}
Gender: ${reportFields.gender ?? "Not provided"}
Age: ${reportFields.age ?? "Not provided"}
Sexual orientation: ${reportFields.sexual_orientation ?? "Not provided"}
Relationship status: ${reportFields.relationship_status ?? "Not provided"}
Relationship structure: ${reportFields.relationship_structure ?? "Not applicable"}
Diagnosed conditions context: ${reportFields.diagnosed_conditions_text ?? "Not provided"}

Attachment profile: ${reportFields.ecr12_label ?? "Not provided"}
Attachment interpretation: ${reportFields.ecr12_text ?? "Not provided"}

Personality profile summary: ${reportFields.bfi10_paragraph ?? "Not provided"}

Depression: ${reportFields.phq8_label ?? "Not provided"}
Anxiety: ${reportFields.gad7_label ?? "Not provided"}
Emotion regulation: ${reportFields.ders16_label ?? "Not provided"}
Body image: ${reportFields.biss_label ?? "Not provided"}
Physical quality of life: ${reportFields.whoqol_phys_label ?? "Not provided"}
Physical quality of life text: ${reportFields.whoqol_phys_text ?? "Not provided"}
Environmental quality of life: ${reportFields.whoqol_env_label ?? "Not provided"}
Environmental quality of life text: ${reportFields.whoqol_env_text ?? "Not provided"}
Relationship score summary: ${reportFields.csi4_label ?? "Not applicable"}

Sexual self-efficacy: ${reportFields.sse_label ?? "Not provided"}
Sexual flexibility: ${reportFields.sexflex_label ?? "Not provided"}

Sexual desire: ${reportFields.sexual_desire_label ?? "Not provided"}
Sexual arousal: ${reportFields.sexual_arousal_label ?? "Not provided"}
Orgasm: ${reportFields.orgasm_label ?? "Not provided"}
Pain: ${reportFields.pain_label ?? "Not provided"}
Sexual satisfaction: ${reportFields.sexual_satisfaction_label ?? "Not provided"}

NATSAL sexual function: ${reportFields.natsal_sf_label ?? "Not provided"}
NATSAL sexual wellbeing: ${reportFields.natsal_sw_label ?? "Not provided"}
`.trim();
}

function shortWHOQOLLabel(label) {
  if (!label) return null;
  return label
    .replace("Physical Health: ", "")
    .replace("Environment: ", "");
}

function shortSeverityLabel(label) {
  if (!label) return null;

  if (label.includes("Minimal")) return "Minimal";
  if (label.includes("Mild")) return "Mild";
  if (label.includes("Moderate")) return "Moderate";
  if (label.includes("Moderately severe")) return "High";
  if (label.includes("Severe")) return "High";
  if (label.includes("Significant")) return "High";
  if (label.includes("Generally good")) return "Low";
  if (label.includes("Low body satisfaction")) return "Low";
  if (label.includes("Moderate body satisfaction")) return "Moderate";
  if (label.includes("Good body satisfaction")) return "Good";
  if (label.includes("High body satisfaction")) return "High";
  if (label.includes("Lower sexual wellbeing")) return "Low";
  if (label.includes("Higher sexual wellbeing")) return "High";
  if (label.includes("Good sexual function")) return "Low";
  if (label.includes("Lowered sexual function")) return "Moderate";
  if (label.includes("Difficulties in sexual function")) return "High";
  if (label === "Lower") return "Low";
  if (label === "Higher") return "High";

  return label;
}

async function generateAISummary(reportFields) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const systemPrompt = [
    "You are a compassionate and professional sexual wellbeing specialist writing a personalised summary for a client who has completed a comprehensive sexual wellbeing assessment.",
    "Your tone is warm, non-judgmental, empowering, and professional.",
    "You never pathologise, shame, or overstate certainty.",
    "You do not list raw scores or rely on heavy clinical jargon.",
    "You weave findings together into a coherent, human narrative.",
    "Write exactly 2 to 3 paragraphs in plain prose only.",
    "Do not use headings, bullet points, apostrophes, or quotation marks.",
    "Do not mention any score numbers.",
    "Do not invent details not present in the input.",
    "Where results are mixed, reflect that nuance clearly.",
    "Where a domain is marked not applicable, ignore it rather than commenting on it.",
    "If a preferred name is provided, use it naturally once near the beginning and not repeatedly."
  ].join(" ");

  const userPrompt = buildPromptFields(reportFields);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return nonEmptyOrNull(content);
}



function buildPdfPayload(finalResult, aiSummary) {
  const rf = finalResult.report_fields;

console.log('SEXUAL SAT DEBUG', {
    sexual_satisfaction_label: rf.sexual_satisfaction_label,
    sexual_satisfaction_text: rf.sexual_satisfaction_text,
    satisfaction_label: rf.satisfaction_label,
    sfunc_sat_label: rf.sfunc_sat_label
  });

  
  return {
    respondent_name: rf.name || "Assessment Participant",
    report_date: new Date().toLocaleDateString("en-AU"),
    diagnosed_conditions: rf.diagnosed_conditions_text,

    email: finalResult.demographics.email,
    gender: rf.gender,
    age: rf.age,
    sexual_orientation: rf.sexual_orientation,
    relationship_status: rf.relationship_status,
    relationship_structure: rf.relationship_structure,

    // overview fields for summary table
    ecr12_overview: rf.ecr12_label,
    bfi10_overview: "See profile",
    phq8_overview: shortSeverityLabel(rf.phq8_label),
    gad7_overview: shortSeverityLabel(rf.gad7_label),
    ders16_overview: shortSeverityLabel(rf.ders16_label),
    biss_overview: shortSeverityLabel(rf.biss_label),
    whoqol_phys_overview: shortWHOQOLLabel(rf.whoqol_phys_label),
    whoqol_env_overview: shortWHOQOLLabel(rf.whoqol_env_label),

    csi4_overview: rf.csi4_label === "Not applicable" ? "Not applicable" : shortSeverityLabel(rf.csi4_label),
    sse_overview: shortSeverityLabel(rf.sse_label),
    sexflex_overview: shortSeverityLabel(rf.sexflex_label),
    sexual_function_overview: "See profile",
    natsal_sf_overview: shortSeverityLabel(rf.natsal_sf_label),
    natsal_sw_overview: shortSeverityLabel(rf.natsal_sw_label),

    // detailed fields used throughout the report
    ecr12_label: rf.ecr12_label,
    ecr12_text: rf.ecr12_text,

    bfi10_paragraph: rf.bfi10_paragraph,

    phq8_label: rf.phq8_label,
    phq8_text: rf.phq8_text,
    gad7_label: rf.gad7_label,
    gad7_text: rf.gad7_text,
    ders16_label: rf.ders16_label,
    ders16_text: rf.ders16_text,
    biss_label: rf.biss_label,
    biss_text: rf.biss_text,

    whoqol_phys_label: rf.whoqol_phys_label,
    whoqol_phys_text: rf.whoqol_phys_text,
    whoqol_env_label: rf.whoqol_env_label,
    whoqol_env_text: rf.whoqol_env_text,

    csi4_label: rf.csi4_label,
    csi4_text: rf.csi4_text,

    sse_label: rf.sse_label,
    sse_text: rf.sse_text,
    sexflex_label: rf.sexflex_label,
    sexflex_text: rf.sexflex_text,

    sfunc_desire_label: rf.sexual_desire_label,
    sfunc_desire_text: rf.sfunc_desire_text,
    sfunc_arousal_label: rf.sexual_arousal_label,
    sfunc_arousal_text: rf.sfunc_arousal_text,
    sfunc_orgasm_label: rf.orgasm_label,
    sfunc_orgasm_text: rf.sfunc_orgasm_text,
    sfunc_pain_label: rf.pain_label,
    sfunc_pain_text: rf.sfunc_pain_text,
    sfunc_sat_label: rf.satisfaction_label,
    sfunc_sat_text: rf.sfunc_sat_text,

    natsal_sf_label: rf.natsal_sf_label,
    natsal_sf_text: rf.natsal_sf_text,
    natsal_sw_label: rf.natsal_sw_label,
    natsal_sw_text: rf.natsal_sw_text,

    ai_summary: aiSummary,

    // optional raw values
    attachment_anxiety_mean: finalResult.attachment.anxiety_mean,
    attachment_avoidance_mean: finalResult.attachment.avoidance_mean,
    phq8_score: finalResult.mental_health.depression.score,
    gad7_score: finalResult.mental_health.anxiety.score,
    ders16_score: finalResult.emotion_regulation.score,
    biss_mean: finalResult.body_image.mean,
    whoqol_phys_score: finalResult.quality_of_life.physical.score,
    whoqol_env_score: finalResult.quality_of_life.environment.score,
    relationship_score: finalResult.relationship.score,
    sse_mean: finalResult.sexual_self_efficacy.mean,
    sexflex_mean: finalResult.sexual_flexibility.mean,
    desire_mean: finalResult.sexual_function.desire.mean,
    arousal_mean: finalResult.sexual_function.arousal.mean,
    orgasm_mean: finalResult.sexual_function.orgasm.mean,
    pain_mean: finalResult.sexual_function.pain.mean,
    sexual_satisfaction_mean: finalResult.sexual_function.satisfaction.mean,
    natsal_sf_score: finalResult.natsal_sf.score,
    natsal_sw_mean: finalResult.natsal_sw.mean
  };
}

async function sendToPdfMonkey(pdfPayload) {
  const apiKey = process.env.PDFMONKEY_API_KEY;
  const templateId = process.env.PDFMONKEY_TEMPLATE_ID;

  if (!apiKey || !templateId) {
    return null;
  }

  const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      document: {
        document_template_id: templateId,
        payload: pdfPayload,
        status: "pending"
      }
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`PDFMonkey error: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}
  
module.exports = async function handler(req, res) {
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
      name: cleanText(getField(fields, FIELD_KEYS.name)?.value) ?? null,
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

    // Attachment
    const scoredAttachment = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.attachment)),
      RESPONSE_MAPS.ecr7
    );

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

    // Personality
    const scoredPersonality = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.personality)),
      RESPONSE_MAPS.bfi5
    );
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
    personality.paragraph = buildBFIParagraph(personality);

    // PHQ and GAD
    const depressionScore = sumScores(
      scoreResponses(parseMatrixResponses(getField(fields, FIELD_KEYS.depression)), RESPONSE_MAPS.phq4)
    );
    const anxietyScore = sumScores(
      scoreResponses(parseMatrixResponses(getField(fields, FIELD_KEYS.anxiety)), RESPONSE_MAPS.gad4)
    );

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

    // DERS
    const scoredDERS = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.ders16)),
      RESPONSE_MAPS.ders5
    );

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

    // BISS
    const scoredBISS = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.biss)),
      RESPONSE_MAPS.biss6
    );
    const bissMean = meanScores(scoredBISS);

    const body_image = {
      mean: round2(bissMean),
      label: classifyBISS(bissMean)
    };

    // WHOQOL
    const whoqolPhysicalResponses = [
      ...parseMatrixResponses(getField(fields, FIELD_KEYS.whoqol_physical_1)),
      ...parseMatrixResponses(getField(fields, FIELD_KEYS.whoqol_physical_2))
    ];
    const scoredWhoqolPhysical = scoreWHOQOLItems(whoqolPhysicalResponses, [0, 1]);
    const whoqolPhysicalSum = scoredWhoqolPhysical.reduce((sum, r) => sum + r.score, 0);
    const whoqolPhysicalScore = ((whoqolPhysicalSum - 7) / 28) * 100;
    const whoqolPhysicalLabel = interpretWHOQOL(whoqolPhysicalScore);

    const whoqolEnvironmentResponses = [
      ...parseMatrixResponses(getField(fields, FIELD_KEYS.whoqol_env_1)),
      ...parseMatrixResponses(getField(fields, FIELD_KEYS.whoqol_env_2))
    ];
    const scoredWhoqolEnvironment = scoreWHOQOLItems(whoqolEnvironmentResponses, []);
    const whoqolEnvironmentSum = scoredWhoqolEnvironment.reduce((sum, r) => sum + r.score, 0);
    const whoqolEnvironmentScore = ((whoqolEnvironmentSum - 8) / 32) * 100;
    const whoqolEnvironmentLabel = interpretWHOQOL(whoqolEnvironmentScore);

    const quality_of_life = {
      physical: {
        score: round0(whoqolPhysicalScore),
        label: `Physical Health: ${whoqolPhysicalLabel}`,
        text: WHOQOL_TEXT.physical[whoqolPhysicalLabel]
      },
      environment: {
        score: round0(whoqolEnvironmentScore),
        label: `Environment: ${whoqolEnvironmentLabel}`,
        text: WHOQOL_TEXT.environment[whoqolEnvironmentLabel]
      }
    };

    // Relationship
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

    // SSE
    const scoredSSE = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.sse)),
      RESPONSE_MAPS.sse5
    );
    const sseMean = meanScores(scoredSSE);

    const sexual_self_efficacy = {
      mean: round2(sseMean),
      label: classifySimpleFive(sseMean)
    };

    // SexFlex
    const scoredSexFlex = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.sexflex)),
      RESPONSE_MAPS.sexflex4
    );
    const sexFlexMean = meanScores(scoredSexFlex);

    const sexual_flexibility = {
      mean: round2(sexFlexMean),
      label: classifySexFlex(sexFlexMean)
    };

    // Sexual function
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

    // NATSAL-SF
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

    // NATSAL-SW
    const scoredNatsalSW = scoreResponses(
      parseMatrixResponses(getField(fields, FIELD_KEYS.natsal_sw)),
      RESPONSE_MAPS.natsalSW5
    );
    const natsalSwMean = meanScores(scoredNatsalSW);

    const natsal_sw = {
      mean: round2(natsalSwMean),
      label: classifyNatsalSW(natsalSwMean)
    };

    // Prompt-ready report fields
    const report_fields = {
  name: demographics.name,
  gender: demographics.gender,
  age: demographics.age,
  sexual_orientation: demographics.sexual_orientation,
  relationship_status: demographics.relationship_status,
  relationship_structure: demographics.relationship_structure,
  diagnosed_conditions_text: demographics.diagnosed_conditions_text,

  ecr12_label: attachment.profile,
  ecr12_text:
    attachment.profile === "Secure"
      ? "Your responses suggest a generally secure attachment pattern. You appear relatively comfortable with emotional closeness while also maintaining an appropriate sense of independence in relationships."
      : attachment.profile === "Anxious"
        ? "Your responses suggest an anxious attachment pattern, with greater sensitivity to closeness, reassurance, or possible loss. This can sometimes make relationships feel emotionally intense or uncertain, particularly during periods of stress or disconnection."
        : attachment.profile === "Avoidant"
          ? "Your responses suggest an avoidant attachment pattern, with more discomfort around closeness or emotional dependence. You may be more likely to protect yourself by pulling back, minimising vulnerability, or relying heavily on self-sufficiency."
          : attachment.profile === "Fearful"
            ? "Your responses suggest a fearful attachment pattern, with both sensitivity to rejection and discomfort with closeness. This can create a push-pull dynamic in relationships, where connection feels strongly wanted but also difficult to trust or sustain."
            : null,

  bfi10_paragraph: personality.paragraph,

  phq8_label: mental_health.depression.label,
  phq8_text:
    mental_health.depression.label === "Minimal depressive symptoms"
      ? "Your responses suggest that low mood is not currently a major concern. While everyone experiences fluctuations in mood, your answers do not indicate a strong pattern of depressive symptoms at this time."
      : mental_health.depression.label === "Mild depressive symptoms"
        ? "Your responses suggest some mild depressive symptoms may be present. This may include periods of lower motivation, reduced pleasure, or feeling flat, but not necessarily at a level that is consistently overwhelming."
        : mental_health.depression.label === "Moderate depressive symptoms"
          ? "Your responses suggest a moderate level of depressive symptoms. This may be affecting motivation, enjoyment, energy, or self-worth in ways that are noticeable and may be relevant to your broader wellbeing."
          : mental_health.depression.label === "Moderately severe depressive symptoms"
            ? "Your responses suggest a high level of depressive symptoms that may be significantly affecting daily life. Difficulties with mood, energy, concentration, or hopelessness may be especially important to consider in understanding your overall profile."
            : "Your responses suggest a very high level of depressive symptoms, which may be having a substantial impact on daily functioning and wellbeing. This is an area that would usually warrant timely clinical attention.",

  gad7_label: mental_health.anxiety.label,
  gad7_text:
    mental_health.anxiety.label === "Minimal anxiety symptoms"
      ? "Your responses suggest that anxiety is not currently a major feature of your profile. While stress may still arise at times, your answers do not indicate a strong ongoing pattern of anxious distress."
      : mental_health.anxiety.label === "Mild anxiety symptoms"
        ? "Your responses suggest some mild anxiety symptoms may be present. This may involve worry, tension, or difficulty relaxing at times, but not necessarily at a level that consistently disrupts daily life."
        : mental_health.anxiety.label === "Moderate anxiety symptoms"
          ? "Your responses suggest a moderate level of anxiety symptoms. Worry, physical tension, restlessness, or difficulty switching off may be relevant contributors to your overall wellbeing at present."
          : "Your responses suggest a high level of anxiety symptoms. Anxiety may be significantly affecting concentration, emotional comfort, sleep, or your ability to feel settled and present in day-to-day life.",

  ders16_label: emotion_regulation.label,
  ders16_text:
    emotion_regulation.label === "Generally good emotion regulation"
      ? "Your responses suggest that you generally manage emotions effectively. This does not mean you never feel distressed, but rather that you are usually able to identify, tolerate, and respond to emotional experiences in a workable way."
      : emotion_regulation.label === "Mild difficulties with emotion regulation"
        ? "Your responses suggest some mild difficulty with emotion regulation. At times emotions may feel harder to understand, settle, or respond to effectively, especially under stress."
        : emotion_regulation.label === "Moderate difficulties with emotion regulation"
          ? "Your responses suggest a moderate level of difficulty with emotion regulation. Emotional experiences may at times feel intense, confusing, or difficult to manage, which can affect other parts of wellbeing and relationships."
          : "Your responses suggest significant difficulties with emotion regulation. Strong emotions may be hard to understand, tolerate, or respond to effectively, and this may have important implications for coping, relationships, and sexual wellbeing.",

  biss_label: body_image.label,
  biss_text:
    body_image.label === "Low body satisfaction"
      ? "Your responses suggest that body image may currently be a source of strain. Feeling uncomfortable, critical, or dissatisfied with your body can affect confidence, intimacy, and the ease of being present in sexual or relational experiences."
      : body_image.label === "Moderate body satisfaction"
        ? "Your responses suggest a mixed or moderate level of body satisfaction. There may be some aspects of your body experience that feel comfortable and others that feel more vulnerable, self-conscious, or difficult."
        : body_image.label === "Good body satisfaction"
          ? "Your responses suggest that body image is generally in a good place. While insecurities may still arise from time to time, your body does not appear to be a major barrier to wellbeing overall."
          : "Your responses suggest a high level of body satisfaction. Feeling relatively comfortable and accepting of your body may be a meaningful strength within your broader wellbeing profile.",

  whoqol_phys_label: quality_of_life.physical.label,
  whoqol_phys_text: quality_of_life.physical.text,
  whoqol_env_label: quality_of_life.environment.label,
  whoqol_env_text: quality_of_life.environment.text,

  csi4_label: relationship.label,
  csi4_text:
    relationship.label === "Not applicable"
      ? "This section is not applicable because you indicated that you are not currently in a relationship."
      : relationship.label === "Lower"
        ? "Your responses suggest that relationship satisfaction may currently be low. There may be meaningful strain, disconnection, or unmet needs within the relationship that are relevant to your overall wellbeing."
        : relationship.label === "Moderate"
          ? "Your responses suggest a mixed or moderate level of relationship satisfaction. Some aspects of the relationship may feel supportive, while others may feel less settled or more strained."
          : "Your responses suggest a relatively positive level of relationship satisfaction. The relationship appears to provide a meaningful degree of connection, support, or stability.",

  sse_label: sexual_self_efficacy.label,
  sse_text:
    sexual_self_efficacy.label === "Lower"
      ? "Your responses suggest lower sexual self-efficacy, meaning you may feel less confident in navigating sexual situations, communicating needs, or responding to difficulties when they arise."
      : sexual_self_efficacy.label === "Moderate"
        ? "Your responses suggest a moderate level of sexual self-efficacy. You may feel confident in some situations while still feeling uncertain or less assured in others."
        : "Your responses suggest higher sexual self-efficacy. You appear to feel relatively confident in your capacity to navigate sexual experiences, communicate needs, and respond to challenges constructively.",

  sexflex_label: sexual_flexibility.label,
  sexflex_text:
    sexual_flexibility.label === "Low sexual flexibility"
      ? "Your responses suggest lower sexual flexibility. Changes, disruptions, or differences in sexual experiences may feel harder to adapt to, which can sometimes increase frustration or self-doubt."
      : sexual_flexibility.label === "Moderate sexual flexibility"
        ? "Your responses suggest a moderate level of sexual flexibility. You may be able to adapt in some situations, while still finding certain changes or challenges more difficult to navigate."
        : "Your responses suggest high sexual flexibility. You appear relatively able to adapt to changes, differences, or disruptions in sexual experiences without those challenges fully undermining your sense of sexual wellbeing.",

  sexual_desire_label: sexual_function.desire.label,
  sfunc_desire_text:
    sexual_function.desire.label === "Lower"
      ? "Your responses suggest that sexual desire may currently be lower. This can reflect many different influences, including stress, mood, physical health, relationship context, or simply where you are in life at the moment."
      : sexual_function.desire.label === "Moderate"
        ? "Your responses suggest a moderate level of sexual desire. Desire may be present but variable, or more dependent on context, emotional connection, or other contributing factors."
        : "Your responses suggest relatively strong sexual desire. Desire does not appear to be a major area of difficulty at present.",

  sexual_arousal_label: sexual_function.arousal.label,
  sfunc_arousal_text:
    sexual_function.arousal.label === "Lower"
      ? "Your responses suggest that arousal may currently be more difficult or less reliable. This can be shaped by stress, anxiety, physical factors, relationship dynamics, and how safe or present you feel in sexual situations."
      : sexual_function.arousal.label === "Moderate"
        ? "Your responses suggest a moderate arousal profile. Arousal may be present but somewhat variable, inconsistent, or more dependent on context."
        : "Your responses suggest relatively good sexual arousal functioning. Arousal does not appear to be a major concern at this time.",

  orgasm_label: sexual_function.orgasm.label,
  sfunc_orgasm_text:
    sexual_function.orgasm.label === "Lower"
      ? "Your responses suggest that orgasm may currently be more difficult, less satisfying, or less consistent. This can be influenced by physical, emotional, relational, and contextual factors rather than any single cause."
      : sexual_function.orgasm.label === "Moderate"
        ? "Your responses suggest a moderate orgasm profile. Orgasm may be achievable in some situations but less consistent, less easy, or less satisfying in others."
        : "Your responses suggest relatively good orgasm functioning. This does not appear to be a major source of difficulty at present.",

  pain_label: sexual_function.pain.label,
  sfunc_pain_text:
  sexual_function.pain.label === "Higher"
    ? "Your responses suggest that pain or physical discomfort may be a significant concern in sexual experiences. This is important clinical information and may warrant further exploration with an appropriately qualified clinician."
    : sexual_function.pain.label === "Moderate"
      ? "Your responses suggest some degree of pain or discomfort may be present in sexual experiences, though not necessarily as a constant or overwhelming problem."
      : "Your responses suggest that pain or physical discomfort is not a major concern in your current sexual functioning.",

  satisfaction_label: sexual_function.satisfaction.label,
  sfunc_sat_text:
    sexual_function.satisfaction.label === "Lower"
      ? "Your responses suggest lower sexual satisfaction. This may reflect a mismatch between what you want from sexual experiences and what currently feels possible, enjoyable, or fulfilling."
      : sexual_function.satisfaction.label === "Moderate"
        ? "Your responses suggest a moderate level of sexual satisfaction. Some aspects of your sexual experiences may feel positive, while others may feel less settled or less fulfilling."
        : "Your responses suggest relatively good sexual satisfaction. Sexual experiences appear to be broadly fulfilling or workable at present.",

  natsal_sf_label: natsal_sf.label,
  natsal_sf_text:
    natsal_sf.label === "Good sexual function"
      ? "Your responses suggest relatively good overall sexual function across the broader areas assessed. Difficulties do not appear to be prominent or distressing overall."
      : natsal_sf.label === "Lowered sexual function"
        ? "Your responses suggest some lowered sexual function overall. There may be a small number of difficulties that are noticeable and relevant, even if not pervasive."
        : "Your responses suggest difficulties in sexual function overall. These concerns may be affecting your sexual wellbeing in ways that are important to acknowledge and may benefit from further support or discussion.",

  natsal_sw_label: natsal_sw.label,
  natsal_sw_text:
    natsal_sw.label === "Lower sexual wellbeing"
      ? "Your responses suggest lower overall sexual wellbeing. Sexual experiences or your relationship to sexuality may currently feel less comfortable, less positive, or less integrated."
      : natsal_sw.label === "Moderate sexual wellbeing"
        ? "Your responses suggest a moderate level of sexual wellbeing. There may be a mix of strengths and difficulties in how sexuality currently fits into your life."
        : "Your responses suggest relatively strong overall sexual wellbeing. Sexuality appears to be a reasonably positive, manageable, or integrated part of your current wellbeing."
};

    const final = {
      demographics,
      attachment,
      personality,
      mental_health,
      emotion_regulation,
      body_image,
      quality_of_life,
      relationship,
      sexual_self_efficacy,
      sexual_flexibility,
      sexual_function,
      natsal_sf,
      natsal_sw,
      report_fields
    };

    console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

let ai_summary = null;
try {
  ai_summary = await generateAISummary(report_fields);
} catch (aiError) {
  console.error("AI SUMMARY ERROR:", aiError.message);
  console.error("FULL ERROR:", aiError);
}

    // PDFMonkey
    let pdfmonkey = null;
    try {
      const pdfPayload = buildPdfPayload(final, ai_summary);
      pdfmonkey = await sendToPdfMonkey(pdfPayload);
    } catch (pdfError) {
      console.error("PDFMONKEY ERROR:", pdfError);
    }

    const responseBody = {
      ...final,
      ai_summary,
      pdfmonkey
    };

    console.log("FINAL REPORT DEBUG:", JSON.stringify(responseBody, null, 2));
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return res.status(500).json({
      error: "Failed",
      message: error.message
    });
  }
}
