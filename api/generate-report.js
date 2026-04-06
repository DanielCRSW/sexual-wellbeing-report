// api/generate-report.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    "Strongly Disagree": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "Strongly Agree": 7
  },
  bfi5: {
    "Strongly Disagree": 1,
    "2": 2,
    "Neutral": 3,
    "4": 4,
    "Strongly Agree": 5
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
    "Very Dissatisfied": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "Very Satisfied": 6
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
    "Strongly Disagree": 1,
    "2": 2,
    "Neither agree nor disagree": 3,
    "4": 4,
    "Strongly Agree": 5
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
    "Strongly Disagree": 1,
    "Disagree": 2,
    "Somewhat disagree": 3,
    "Neither agree nor disagree": 4,
    "Somewhat agree": 5,
    "Agree": 6,
    "Strongly Agree": 7
  },
  whoqol5: {
    "Not at all": 1,
    "A little": 2,
    "Moderately": 3,
    "Mostly": 4,
    "Completely": 5,
    "Very Dissatisfied": 1,
    "Dissatisfied": 2,
    "Neither satisfied nor dissatisfied": 3,
    "Satisfied": 4,
    "Very Satisfied": 5
  }
};

const WHOQOL_TEXT = {
  physical: {
    Poor: "Your responses suggest your physical health is significantly affecting your quality of life. Pain, fatigue, sleep difficulties, or reduced mobility may be placing a considerable strain on your day-to-day functioning. These kinds of physical challenges can make even routine tasks feel effortful, and over time they can affect mood, relationships, and overall wellbeing. It is worth speaking with a healthcare professional if you have not already done so, as there may be support available to help manage these difficulties. Understanding the physical dimension of your wellbeing is an important first step toward making meaningful change.",

    Fair: "Your responses suggest your physical health is having a moderate impact on your quality of life. You may notice some physical limitations or discomfort on a regular basis, even if they do not feel overwhelming all of the time. These concerns can still quietly affect your energy levels, motivation, sleep, or ability to engage fully in activities you value. It may be worth monitoring how your physical health fluctuates and considering whether additional support or lifestyle adjustments could help. Small, consistent changes to sleep, movement, or medical care can sometimes make a meaningful difference over time.",

    Good: "Your responses suggest your physical health is generally good and not significantly interfering with daily life. While occasional physical concerns may arise, they do not appear to be creating major or consistent limitations for you at this time. This is a positive foundation, as good physical health supports energy, mood, and the capacity to engage in meaningful activities and relationships. Maintaining this through regular movement, adequate rest, and preventative healthcare can help sustain your quality of life over the long term. It is still worth staying attentive to any changes, as physical health can shift gradually before it becomes more noticeable.",

    "Very Good": "Your responses suggest your physical health is a genuine strength in your overall profile. You appear to have good energy, functional capacity, and physical wellbeing that supports your ability to engage fully in daily life. Strong physical health provides an important foundation for emotional resilience, sexual wellbeing, and relationship satisfaction, areas that are often underestimated in their connection to the body. This is something worth actively protecting through sustainable habits around sleep, movement, nutrition, and stress management. Recognising physical health as a resource, rather than taking it for granted, can help you maintain this advantage over time."
  },

  environment: {
    Poor: "Your responses suggest your environment is significantly affecting your quality of life. Concerns about safety, financial security, access to healthcare, housing stability, or the quality of your immediate surroundings may be placing real strain on your overall wellbeing. Environmental stressors of this kind are often underestimated, but they can have a pervasive effect on mood, stress levels, and the ability to focus on other areas of life such as relationships and intimacy. It can be difficult to address personal or relational goals when the broader context feels unstable or unsupportive. Where possible, identifying even small changes to your environment or seeking practical support may help reduce some of this burden.",

    Fair: "Your responses suggest your environment is having a moderate impact on your quality of life. Some aspects of your living situation, access to resources, or broader circumstances may be creating intermittent stress or limitation, even if things feel manageable on the surface. Environmental pressures that are not addressed can gradually erode energy and motivation, making it harder to invest in relationships, self-care, or personal goals. It may be helpful to reflect on which specific environmental factors feel most constraining and whether any practical steps could improve them. Even modest improvements in areas like financial security, neighbourhood safety, or access to services can have a meaningful effect on day-to-day wellbeing.",

    Good: "Your responses suggest your environment is generally supportive of your quality of life. Your living situation, access to resources, and broader practical circumstances do not appear to be creating significant barriers at this time. Having a stable and functional environment provides an important platform for attending to other dimensions of wellbeing, including relationships, emotional health, and sexual satisfaction. While there may still be aspects of your environment you would like to improve, these do not appear to be major sources of stress or limitation right now. Continuing to invest in the practical foundations of your life (housing, finances, community, and safety) helps sustain the conditions in which other areas of wellbeing can thrive.",

    "Very Good": "Your responses suggest your environment is a genuine strength in your overall quality of life profile. You appear to have good access to resources, a stable living situation, and a broader environment that supports rather than undermines your wellbeing. This kind of environmental security is often invisible when it is working well, but it provides a critical foundation for emotional regulation, relationship quality, and the capacity to pursue meaningful goals. Feeling safe, resourced, and connected to your community creates the conditions in which personal and relational flourishing becomes possible. This is worth recognising as an asset, and where possible, protecting and building upon it over time."
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

// ─── Bar chart percentage functions ───────────────────────────────────────────
// Each function maps a score band to a 0-100 integer for the PDF profile chart.
// Scales where lower = better (pain, natsal_sf) are inverted so the bar always
// reads left-to-right as "more bar = better outcome".
// Bars >= 50 render in the brand colour; bars < 50 render in yellow (#f1cd15).

function barPctECR(profile) {
  // Secure = 100 (good). All insecure profiles = 30 (concern).
  if (profile == null) return null;
  return profile === "Secure" ? 100 : 30;
}

function barPctPHQ8(score) {
  // Minimal=100, Mild=75 → good (>=50). Moderate=40, Mod-severe=25, Severe=10 → concern (<50).
  if (score == null) return null;
  if (score <= 4)  return 100;
  if (score <= 9)  return 75;
  if (score <= 14) return 40;
  if (score <= 19) return 25;
  return 10;
}

function barPctGAD7(score) {
  // Minimal=100, Mild=75 → good. Moderate=40, Severe=15 → concern.
  if (score == null) return null;
  if (score <= 4)  return 100;
  if (score <= 9)  return 75;
  if (score <= 14) return 40;
  return 15;
}

function barPctDERS16(score) {
  // Good=100, Mild=70 → good. Moderate=40, Significant=15 → concern.
  if (score == null) return null;
  if (score <= 31) return 100;
  if (score <= 45) return 70;
  if (score <= 59) return 40;
  return 15;
}

function barPctBISS(mean) {
  // High=100, Good=75 → good. Moderate=45, Low=15 → concern.
  if (mean == null) return null;
  if (mean > 5.0) return 100;
  if (mean > 4.0) return 75;
  if (mean > 2.5) return 45;
  return 15;
}

function barPctWHOQOL(label) {
  // Very Good=100, Good=75 → good. Fair=45, Poor=15 → concern.
  if (label == null) return null;
  if (label === "Very Good") return 100;
  if (label === "Good")      return 75;
  if (label === "Fair")      return 45;
  return 15;
}

function barPctSimpleFive(label) {
  // Higher=100 → good. Moderate=45, Lower=15 → concern.
  // Used for: SSE, relationship (CSI-4), desire, arousal, orgasm, satisfaction, natsal_sw.
  if (label == null) return null;
  if (label === "Higher") return 100;
  if (label === "Moderate") return 45;
  return 15;
}

function barPctSexFlex(label) {
  // High=100, Moderate=60 → good. Low=20 → concern.
  if (label == null) return null;
  if (label === "High sexual flexibility")     return 100;
  if (label === "Moderate sexual flexibility") return 60;
  return 20;
}

function barPctPain(label) {
  // INVERTED: Lower pain = good. Lower=100, Moderate=45, Higher=15.
  if (label == null) return null;
  if (label === "Lower")    return 100;
  if (label === "Moderate") return 45;
  return 15;
}

function barPctNatsalSF(label) {
  // INVERTED: Good function = 100, Lowered = 45, Difficulties = 15.
  if (label == null) return null;
  if (label === "Good sexual function")        return 100;
  if (label === "Lowered sexual function")     return 45;
  return 15;
}

function barPctNatsalSW(label) {
  // Higher=100 → good. Moderate=45, Lower=15 → concern.
  if (label == null) return null;
  if (label === "Higher sexual wellbeing")   return 100;
  if (label === "Moderate sexual wellbeing") return 45;
  return 15;
}
// ─────────────────────────────────────────────────────────────────────────────

// Returns the CSS class strings for a bar and its badge based on percentage and part.
// part: 'p1' (cyan) or 'p2' (pink). pct < 50 always gets concern (yellow).
function barClasses(pct, part) {
  if (pct == null) return { bar: 'gb-na', badge: 'badge-na' };
  if (pct >= 50) return { bar: `gb-good-${part}`, badge: `badge-good-${part}` };
  return { bar: 'gb-concern', badge: 'badge-concern' };
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
Sexual satisfaction: ${reportFields.satisfaction_label ?? "Not provided"}

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
  if (label.includes("Severe")) return "Very High";
  if (label.includes("Significant")) return "High";
  if (label.includes("Generally good")) return "Good";
  if (label.includes("Low body satisfaction")) return "Lower";
  if (label.includes("Moderate body satisfaction")) return "Moderate";
  if (label.includes("Good body satisfaction")) return "Good";
  if (label.includes("High body satisfaction")) return "High";
  if (label.includes("Lower sexual wellbeing")) return "Low";
  if (label.includes("Higher sexual wellbeing")) return "High";
  if (label.includes("Good sexual function")) return "Good function";
  if (label.includes("Lowered sexual function")) return "Moderate function";
  if (label.includes("Difficulties in sexual function")) return "High difficulties";
  if (label === "Lower") return "Lower";
  if (label === "Moderate") return "Moderate";
  if (label === "Higher") return "Higher";

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
    "Write exactly 3 to 4 paragraphs in plain prose only.",
    "Begin by first providing a summary of the information related to the broad psychological factors. Then move onto integrating the specific sexual wellbeing measures. Finish by providing a summary of the key factors that are likely positively influencing and then negatively influencing their sexual wellbeing.",
    "Do not use headings but do appropriatey chunk the paragraphs but no bullet points, apostrophes, or quotation marks.",
    "Do not mention any score numbers or names of measures.",
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

  // Derive the raw WHOQOL band labels (strip the "Physical Health: " / "Environment: " prefix)
  const whoqolPhysRaw = shortWHOQOLLabel(rf.whoqol_phys_label);
  const whoqolEnvRaw  = shortWHOQOLLabel(rf.whoqol_env_label);

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
    whoqol_phys_overview: whoqolPhysRaw,
    whoqol_env_overview: whoqolEnvRaw,

    csi4_overview: rf.csi4_label === "Not applicable" ? "Not applicable" : shortSeverityLabel(rf.csi4_label),
    sse_overview: shortSeverityLabel(rf.sse_label),
    sexflex_overview: shortSeverityLabel(rf.sexflex_label),
    sexual_function_overview: "See profile",
    natsal_sf_overview: shortSeverityLabel(rf.natsal_sf_label),
    natsal_sw_overview: shortSeverityLabel(rf.natsal_sw_label),

    // ── Bar chart percentage values + CSS class names ────────────────────────
    // _bar_pct drives the bar width. _bar_class and _badge_class are passed
    // directly into the template so no Handlebars logic helpers are needed.
    // Part 1 scales use 'p1' (cyan), Part 2 scales use 'p2' (pink).
    ecr12_bar_pct:              barPctECR(rf.ecr12_label),
    ecr12_bar_class:            barClasses(barPctECR(rf.ecr12_label), 'p1').bar,
    ecr12_badge_class:          barClasses(barPctECR(rf.ecr12_label), 'p1').badge,

    phq8_bar_pct:               barPctPHQ8(finalResult.mental_health.depression.score),
    phq8_bar_class:             barClasses(barPctPHQ8(finalResult.mental_health.depression.score), 'p1').bar,
    phq8_badge_class:           barClasses(barPctPHQ8(finalResult.mental_health.depression.score), 'p1').badge,

    gad7_bar_pct:               barPctGAD7(finalResult.mental_health.anxiety.score),
    gad7_bar_class:             barClasses(barPctGAD7(finalResult.mental_health.anxiety.score), 'p1').bar,
    gad7_badge_class:           barClasses(barPctGAD7(finalResult.mental_health.anxiety.score), 'p1').badge,

    ders16_bar_pct:             barPctDERS16(finalResult.emotion_regulation.score),
    ders16_bar_class:           barClasses(barPctDERS16(finalResult.emotion_regulation.score), 'p1').bar,
    ders16_badge_class:         barClasses(barPctDERS16(finalResult.emotion_regulation.score), 'p1').badge,

    biss_bar_pct:               barPctBISS(finalResult.body_image.mean),
    biss_bar_class:             barClasses(barPctBISS(finalResult.body_image.mean), 'p1').bar,
    biss_badge_class:           barClasses(barPctBISS(finalResult.body_image.mean), 'p1').badge,

    whoqol_phys_bar_pct:        barPctWHOQOL(whoqolPhysRaw),
    whoqol_phys_bar_class:      barClasses(barPctWHOQOL(whoqolPhysRaw), 'p1').bar,
    whoqol_phys_badge_class:    barClasses(barPctWHOQOL(whoqolPhysRaw), 'p1').badge,

    whoqol_env_bar_pct:         barPctWHOQOL(whoqolEnvRaw),
    whoqol_env_bar_class:       barClasses(barPctWHOQOL(whoqolEnvRaw), 'p1').bar,
    whoqol_env_badge_class:     barClasses(barPctWHOQOL(whoqolEnvRaw), 'p1').badge,

    // Relationship — special case: not applicable gets a full-width greyed bar
    csi4_bar_pct:               rf.csi4_label === 'Not applicable' ? 100 : barPctSimpleFive(rf.csi4_label),
    csi4_bar_class:             rf.csi4_label === 'Not applicable' ? 'gb-na' : barClasses(barPctSimpleFive(rf.csi4_label), 'p2').bar,
    csi4_badge_class:           rf.csi4_label === 'Not applicable' ? 'badge-na' : barClasses(barPctSimpleFive(rf.csi4_label), 'p2').badge,
    csi4_bar_style:             rf.csi4_label === 'Not applicable' ? 'opacity:0.4;' : '',

    sse_bar_pct:                barPctSimpleFive(rf.sse_label),
    sse_bar_class:              barClasses(barPctSimpleFive(rf.sse_label), 'p2').bar,
    sse_badge_class:            barClasses(barPctSimpleFive(rf.sse_label), 'p2').badge,

    sexflex_bar_pct:            barPctSexFlex(rf.sexflex_label),
    sexflex_bar_class:          barClasses(barPctSexFlex(rf.sexflex_label), 'p2').bar,
    sexflex_badge_class:        barClasses(barPctSexFlex(rf.sexflex_label), 'p2').badge,

    sfunc_desire_bar_pct:       barPctSimpleFive(rf.sexual_desire_label),
    sfunc_desire_bar_class:     barClasses(barPctSimpleFive(rf.sexual_desire_label), 'p2').bar,
    sfunc_desire_badge_class:   barClasses(barPctSimpleFive(rf.sexual_desire_label), 'p2').badge,

    sfunc_arousal_bar_pct:      barPctSimpleFive(rf.sexual_arousal_label),
    sfunc_arousal_bar_class:    barClasses(barPctSimpleFive(rf.sexual_arousal_label), 'p2').bar,
    sfunc_arousal_badge_class:  barClasses(barPctSimpleFive(rf.sexual_arousal_label), 'p2').badge,

    sfunc_orgasm_bar_pct:       barPctSimpleFive(rf.orgasm_label),
    sfunc_orgasm_bar_class:     barClasses(barPctSimpleFive(rf.orgasm_label), 'p2').bar,
    sfunc_orgasm_badge_class:   barClasses(barPctSimpleFive(rf.orgasm_label), 'p2').badge,

    sfunc_pain_bar_pct:         barPctPain(rf.pain_label),
    sfunc_pain_bar_class:       barClasses(barPctPain(rf.pain_label), 'p2').bar,
    sfunc_pain_badge_class:     barClasses(barPctPain(rf.pain_label), 'p2').badge,

    sfunc_sat_bar_pct:          barPctSimpleFive(rf.satisfaction_label),
    sfunc_sat_bar_class:        barClasses(barPctSimpleFive(rf.satisfaction_label), 'p2').bar,
    sfunc_sat_badge_class:      barClasses(barPctSimpleFive(rf.satisfaction_label), 'p2').badge,

    natsal_sf_bar_pct:          barPctNatsalSF(rf.natsal_sf_label),
    natsal_sf_bar_class:        barClasses(barPctNatsalSF(rf.natsal_sf_label), 'p2').bar,
    natsal_sf_badge_class:      barClasses(barPctNatsalSF(rf.natsal_sf_label), 'p2').badge,

    natsal_sw_bar_pct:          barPctNatsalSW(rf.natsal_sw_label),
    natsal_sw_bar_class:        barClasses(barPctNatsalSW(rf.natsal_sw_label), 'p2').bar,
    natsal_sw_badge_class:      barClasses(barPctNatsalSW(rf.natsal_sw_label), 'p2').badge,
    // ────────────────────────────────────────────────────────────────────────

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

async function waitForPdfMonkeyDocument(documentId, maxAttempts = 10, delayMs = 3000) {
  const apiKey = process.env.PDFMONKEY_API_KEY;
  if (!apiKey) throw new Error("Missing PDFMONKEY_API_KEY");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${documentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`PDFMonkey poll error: ${response.status} ${text}`);
    }

    const data = JSON.parse(text);
    const doc = data.document;

    if (doc.status === "success" && doc.download_url) {
      return doc;
    }

    if (doc.status === "failure") {
      throw new Error(`PDF generation failed`);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("PDF was not ready in time");
}

async function sendEmailWithBrevo(to, name, pdfUrl) {
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  console.log("BREVO KEY EXISTS:", !!brevoApiKey);

  if (!brevoApiKey) {
    throw new Error("Missing BREVO_API_KEY");
  }

  const pdfResponse = await fetch(pdfUrl);
  if (!pdfResponse.ok) {
    throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
  }

  const pdfArrayBuffer = await pdfResponse.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfArrayBuffer).toString("base64");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoApiKey
    },
    body: JSON.stringify({
      sender: {
        name: "Centre for Relational & Sexual Wellbeing",
        email: "info@centrersw.com"
      },
      to: [
        {
          email: to,
          name: name || "Client"
        }
      ],
      subject: "Your Sexual Wellbeing Report",
      attachment: [
        {
          name: "sexual-wellbeing-report.pdf",
          content: pdfBase64
        }
      ],
      htmlContent: `
  <p>Hi ${name || "there"},</p>
  <p>Thank you so much for completing <strong>Your Sexual Wellbeing Assessment</strong>.</p>
  <p>We want to remind you that this is not a clinical or diagnostic report. However, we really hope it provides a helpful tool to learn more about yourself.</p>
  <p>If you are looking for some professional support, we would be happy to help at the Centre for Relational and Sexual Wellbeing. Check out our clinicians and services at <a href="https://www.centrersw.com">www.centrersw.com</a></p>
  <p>Your Sexual Wellbeing Report is attached as a PDF.</p>
  <p>Warm regards,<br>The Centre for Relational and Sexual Wellbeing Team</p>
`
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Brevo error: ${response.status} ${text}`);
  }

  return JSON.parse(text);
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

    const tokenField = fields.find(field => field.label === 'token');

    const demographics = {
      token: cleanText(tokenField?.value) ?? null,
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

    if (!demographics.token) {
      return res.status(403).send(`
        <h2>Access error</h2>
        <p>This assessment link is incomplete.</p>
        <p>Please use the link sent to your email after purchase, or contact info@centrersw.com.</p>
      `);
    }

    const { data: tokenRow, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token', demographics.token)
      .single();

    if (tokenError || !tokenRow) {
      return res.status(403).send(`
        <h2>Invalid access link</h2>
        <p>This assessment link is not recognised or may have expired.</p>
        <p>Please use your original link or contact info@centrersw.com.</p>
      `);
    }

    if (tokenRow.used) {
      return res.status(403).send(`
        <h2>This assessment link has already been used</h2>
        <p>Your report has already been generated.</p>
        <p>If you believe this is an error, please contact info@centrersw.com.</p>
      `);
    }

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
      ? "Your responses suggest a generally secure attachment pattern. You appear relatively comfortable with emotional closeness while also maintaining an appropriate sense of independence in relationships. People with secure attachment tend to find it easier to trust others, communicate needs openly, and recover from relational difficulties without becoming overwhelmed. This is a meaningful strength, as secure attachment is associated with greater relationship satisfaction, better emotional regulation, and more positive sexual wellbeing overall."
      : attachment.profile === "Anxious"
        ? "Your responses suggest an anxious attachment pattern, with greater sensitivity to closeness, reassurance, or possible loss. This can sometimes make relationships feel emotionally intense or uncertain, particularly during periods of stress or disconnection. You may find yourself seeking more reassurance than others seem to offer, or feeling unsettled when a partner seems distant or less engaged. These patterns often develop early in life and likely reflect how you learned to navigate closeness. Understanding your attachment style can be a useful starting point for building more security in relationships over time."
        : attachment.profile === "Avoidant"
          ? "Your responses suggest an avoidant attachment pattern, with more discomfort around closeness or emotional dependence. You may be more likely to protect yourself by pulling back, minimising vulnerability, or relying heavily on self-sufficiency when relationships feel demanding. While this can offer a sense of control or safety, it may also create distance in intimate relationships or make it harder to ask for support when you need it. Avoidant patterns often develop as a response to early experiences where closeness felt unreliable or unsafe. Recognising this pattern is a valuable step toward understanding how it may be shaping your current relationships and sexual experiences."
          : attachment.profile === "Fearful"
            ? "Your responses suggest a fearful attachment pattern, with both sensitivity to rejection and discomfort with closeness. This can create a push-pull dynamic in relationships, where connection feels strongly wanted but also difficult to trust or sustain. You may find yourself drawn toward intimacy while simultaneously pulling back when it feels too close or too risky. This pattern can be particularly challenging in sexual and romantic relationships, where vulnerability is unavoidable. It is one of the more complex attachment profiles, and many people find it helpful to explore with a psychologist or therapist who can provide a safe space to work through these patterns."
            : null,

  bfi10_paragraph: personality.paragraph,

  phq8_label: mental_health.depression.label,
  phq8_text:
    mental_health.depression.label === "Minimal depressive symptoms"
      ? "Your responses suggest that low mood is not currently a major concern. While everyone experiences fluctuations in mood, your answers do not indicate a strong pattern of depressive symptoms at this time. This is a positive sign for your overall wellbeing, as mood has a significant influence on motivation, sexual desire, relationship quality, and day-to-day functioning. Continuing to invest in the things that support your emotional health, such as connection, meaningful activity, rest, and movement, can help maintain this foundation."
      : mental_health.depression.label === "Mild depressive symptoms"
        ? "Your responses suggest some mild depressive symptoms may be present. This may include periods of lower motivation, reduced pleasure, or feeling flat, but not necessarily at a level that is consistently overwhelming. Even mild depression can quietly affect energy, libido, self-worth, and the quality of close relationships over time. It is worth paying attention to whether these symptoms are persistent, and considering whether lifestyle adjustments or additional support might be helpful. Catching and addressing low mood early is often more effective than waiting until it becomes more entrenched."
        : mental_health.depression.label === "Moderate depressive symptoms"
          ? "Your responses suggest a moderate level of depressive symptoms. This may be affecting motivation, enjoyment, energy, or self-worth in ways that are noticeable and may be relevant to your broader wellbeing. Moderate depression can have a meaningful impact on sexual desire, relationship satisfaction, and the ability to feel present and engaged in everyday life. It is worth taking these symptoms seriously and considering whether speaking with a GP or mental health professional might be a useful next step. Support is available, and many people find that even modest intervention at this level can make a significant difference."
          : mental_health.depression.label === "Moderately severe depressive symptoms"
            ? "Your responses suggest a high level of depressive symptoms that may be significantly affecting daily life. Difficulties with mood, energy, concentration, or hopelessness may be especially important to consider in understanding your overall profile. At this level, depression can substantially affect relationships, sexual wellbeing, work, and the ability to engage in activities that usually bring meaning or pleasure. We would encourage you to speak with a GP or mental health professional if you have not already done so, as effective support is available. You do not have to manage this alone, and seeking help is a sign of self-awareness, not weakness."
            : mental_health.depression.label === "Severe depressive symptoms"
              ? "Your responses suggest a very high level of depressive symptoms, which may be having a substantial impact on daily functioning and wellbeing. This is an area that would usually warrant timely clinical attention, and we would strongly encourage you to reach out to a GP, psychologist, or mental health service as soon as possible. Severe depression affects almost every domain of life, including relationships, sexual wellbeing, physical health, and the capacity to find meaning or pleasure in daily experience. Support is available and effective, and early intervention typically leads to better outcomes. Please do not hesitate to seek help."
              : null,

  gad7_label: mental_health.anxiety.label,
  gad7_text:
    mental_health.anxiety.label === "Minimal anxiety symptoms"
      ? "Your responses suggest that anxiety is not currently a major feature of your profile. While stress may still arise at times, your answers do not indicate a strong ongoing pattern of anxious distress. This is a positive foundation, as lower anxiety is associated with greater ease in relationships, more consistent sexual functioning, and better overall emotional wellbeing. Maintaining habits that support a regulated nervous system, such as adequate sleep, physical activity, and time to decompress, can help sustain this."
      : mental_health.anxiety.label === "Mild anxiety symptoms"
        ? "Your responses suggest some mild anxiety symptoms may be present. This may involve worry, tension, or difficulty relaxing at times, but not necessarily at a level that consistently disrupts daily life. Mild anxiety is very common and can often be managed through self-awareness, lifestyle adjustments, and stress management strategies. It is worth noticing whether anxiety tends to spike in particular contexts, such as during intimacy, conflict, or uncertainty, as this can provide useful information about where targeted support might help."
        : mental_health.anxiety.label === "Moderate anxiety symptoms"
          ? "Your responses suggest a moderate level of anxiety symptoms. Worry, physical tension, restlessness, or difficulty switching off may be relevant contributors to your overall wellbeing at present. Anxiety at this level can affect sleep, concentration, relationship dynamics, and sexual functioning, often in ways that are not immediately obvious. It may be worth considering whether speaking with a GP or psychologist could help you develop more effective strategies for managing these symptoms. Many people find that even a short course of support significantly reduces anxiety and improves quality of life."
          : mental_health.anxiety.label === "Severe anxiety symptoms"
            ? "Your responses suggest a high level of anxiety symptoms. Anxiety may be significantly affecting concentration, emotional comfort, sleep, or your ability to feel settled and present in day-to-day life. At this level, anxiety can become a major barrier to intimacy, relationship satisfaction, and sexual wellbeing, as it is very difficult to be present and engaged when the nervous system is under persistent strain. We would encourage you to speak with a GP or mental health professional, as effective treatments for anxiety are well-established and widely available. Taking this step is an important investment in your overall wellbeing."
            : null,

  ders16_label: emotion_regulation.label,
  ders16_text:
    emotion_regulation.label === "Generally good emotion regulation"
      ? "Your responses suggest that you generally manage emotions effectively. This does not mean you never feel distressed, but rather that you are usually able to identify, tolerate, and respond to emotional experiences in a workable way. Good emotion regulation is a significant asset in both relationships and sexual wellbeing, as it supports the ability to stay present, communicate clearly, and recover from difficulties without becoming overwhelmed. This capacity tends to strengthen over time with self-awareness and practice, and it is worth continuing to nurture."
      : emotion_regulation.label === "Mild difficulties with emotion regulation"
        ? "Your responses suggest some mild difficulty with emotion regulation. At times emotions may feel harder to understand, settle, or respond to effectively, especially under stress. These difficulties can occasionally spill into relationships or intimate experiences, making it harder to communicate needs or recover from conflict. Many people find that developing a greater vocabulary for their emotional experience and building in regular opportunities for rest and reflection, and helps strengthen this area over time."
        : emotion_regulation.label === "Moderate difficulties with emotion regulation"
          ? "Your responses suggest a moderate level of difficulty with emotion regulation. Emotional experiences may at times feel intense, confusing, or difficult to manage, which can affect other parts of wellbeing and relationships. When emotions are hard to regulate, it can become difficult to stay present during intimacy, to communicate needs clearly, or to repair relationship ruptures effectively. These patterns are very common and are often rooted in earlier experiences rather than any personal failing. Working with a psychologist on emotion regulation strategies can be genuinely transformative for both personal and relational wellbeing."
          : emotion_regulation.label === "Significant difficulties with emotion regulation"
            ? "Your responses suggest significant difficulties with emotion regulation. Strong emotions may be hard to understand, tolerate, or respond to effectively, and this may have important implications for coping, relationships, and sexual wellbeing. At this level, emotional dysregulation can feel exhausting and isolating, and may lead to patterns of avoidance, conflict, or shutdown that are difficult to break without support. We would encourage you to consider speaking with a psychologist or therapist, as there are well-evidenced approaches that are specifically designed to build emotional regulation skills."
            : null,

  biss_label: body_image.label,
  biss_text:
    body_image.label === "Low body satisfaction"
      ? "Your responses suggest that body image may currently be a source of strain. Feeling uncomfortable, critical, or dissatisfied with your body can affect confidence, intimacy, and the ease of being present in sexual or relational experiences. Negative body image is extremely common and is shaped by a complex mix of personal history, cultural messages, and lived experience as it is not a reflection of how your body actually appears to others. When body dissatisfaction is significant, it can act as a barrier to sexual pleasure, vulnerability, and connection, often in ways that are not immediately obvious. It may be worth exploring this area with a clinician who has experience in body image, as meaningful change is possible."
      : body_image.label === "Moderate body satisfaction"
        ? "Your responses suggest a mixed or moderate level of body satisfaction. There may be some aspects of your body experience that feel comfortable and others that feel more vulnerable, self-conscious, or difficult. This kind of ambivalence is very common and reflects the complexity of how most people relate to their bodies, particularly in a culture that places significant pressure on appearance. It is worth noticing when and where body concerns tend to show up most, for example, during intimacy, in certain clothing, or at particular times of the month or year, as this can provide useful information about patterns worth addressing."
        : body_image.label === "Good body satisfaction"
          ? "Your responses suggest that body image is generally in a good place. While insecurities may still arise from time to time, your body does not appear to be a major barrier to wellbeing or intimacy overall. A reasonably positive relationship with your body supports confidence, presence during sexual experiences, and the ability to connect with a partner without significant self-consciousness getting in the way. This is a genuine asset, and it is worth continuing to nurture a compassionate and functional relationship with your body as life circumstances change."
          : body_image.label === "High body satisfaction"
            ? "Your responses suggest a high level of body satisfaction. Feeling relatively comfortable and accepting of your body is a meaningful strength within your broader wellbeing profile. Positive body image supports sexual confidence, ease during intimacy, and the capacity to be present and engaged rather than self-monitoring. This does not mean you feel perfect about your body at all times, but rather that you have developed a reasonably stable and accepting relationship with it, which is something many people work hard to cultivate."
            : null,

  whoqol_phys_label: quality_of_life.physical.label,
  whoqol_phys_text: quality_of_life.physical.text,
  whoqol_env_label: quality_of_life.environment.label,
  whoqol_env_text: quality_of_life.environment.text,

  csi4_label: relationship.label,
  csi4_text:
    relationship.label === "Not applicable"
      ? "This section is not applicable because you indicated that you are not currently in a relationship."
      : relationship.label === "Lower"
        ? "Your responses suggest that relationship satisfaction may currently be low. There may be meaningful strain, disconnection, or unmet needs within the relationship that are affecting your overall wellbeing. Relationship dissatisfaction is one of the most common contributors to reduced sexual wellbeing, as it is difficult to feel desire, openness, or pleasure when the relational foundation feels unstable or unsatisfying. It can be helpful to reflect on whether these difficulties feel like a temporary rough patch or a more persistent pattern, and whether both partners are aware of and willing to address the concerns. Couples therapy or relationship counselling can be a productive space to begin working through these challenges."
        : relationship.label === "Moderate"
          ? "Your responses suggest a mixed or moderate level of relationship satisfaction. Some aspects of the relationship may feel supportive and positive, while others may feel less settled, less connected, or more strained. This kind of ambivalence is common in long-term relationships and does not necessarily signal a fundamental problem, but it is worth paying attention to, particularly if the less satisfying aspects are persistent or worsening. Relationships tend to thrive with intentional investment in communication, quality time, and addressing difficulties before they become entrenched. Even small improvements in relational quality can have a meaningful flow-on effect to sexual wellbeing and overall life satisfaction."
          : relationship.label === "Higher"
            ? "Your responses suggest a relatively positive level of relationship satisfaction. The relationship appears to provide a meaningful degree of connection, support, and stability in your life. Relationship satisfaction is one of the most consistent predictors of sexual wellbeing and overall quality of life, so this is a genuine asset worth recognising and protecting. Continuing to invest in communication, shared experience, and mutual care tends to sustain and deepen relational satisfaction over time."
            : null,

  sse_label: sexual_self_efficacy.label,
  sse_text:
    sexual_self_efficacy.label === "Lower"
      ? "Your responses suggest lower sexual self-efficacy, meaning you may feel less confident in navigating sexual situations, communicating needs, or responding to difficulties when they arise. Low sexual self-efficacy can make it harder to initiate, set boundaries, ask for what you want, or manage setbacks without feeling discouraged or ashamed. These feelings are very common and are often shaped by past experiences, messages received about sexuality, or a lack of opportunity to develop confidence in this area. Building sexual self-efficacy is possible and tends to improve gradually through experience, education, and sometimes working with a clinician who specialises in sexual wellbeing."
      : sexual_self_efficacy.label === "Moderate"
        ? "Your responses suggest a moderate level of sexual self-efficacy. You may feel confident navigating some sexual situations while still feeling uncertain, hesitant, or less assured in others. This is a common profile and often reflects the natural variability of sexual experience where confidence tends to be higher in familiar or low-pressure contexts and lower when facing new challenges or difficulties. Continuing to develop self-awareness around sexuality, and gradually building skills in communication and self-advocacy, can help strengthen this area over time."
        : sexual_self_efficacy.label === "Higher"
          ? "Your responses suggest higher sexual self-efficacy. You appear to feel relatively confident in your capacity to navigate sexual experiences, communicate needs, and respond to challenges constructively. Sexual self-efficacy is a meaningful protective factor; people who feel more capable and confident in sexual contexts tend to experience greater satisfaction, recover more readily from difficulties, and communicate more effectively with partners. This is a genuine strength within your sexual wellbeing profile."
          : null,

  sexflex_label: sexual_flexibility.label,
  sexflex_text:
    sexual_flexibility.label === "Low sexual flexibility"
      ? "Your responses suggest lower sexual flexibility. Changes, disruptions, or differences in sexual experiences may feel harder to adapt to, which can sometimes increase frustration, self-doubt, or avoidance. Sexual flexibility refers to the capacity to adjust expectations, find alternative sources of pleasure, and maintain a workable relationship with sexuality even when things do not go as hoped. When flexibility is lower, temporary difficulties can sometimes feel more permanent or more threatening than they need to. Developing a broader and more adaptable view of sexual experience is something that can be supported through psychoeducation and, where helpful, working with a sex-positive clinician."
      : sexual_flexibility.label === "Moderate sexual flexibility"
        ? "Your responses suggest a moderate level of sexual flexibility. You may be able to adapt and adjust in some situations, while still finding certain changes, limitations, or unexpected challenges more difficult to navigate. This is a common profile and reflects the reality that most people have areas of sexuality where they feel more or less adaptable. Building flexibility tends to involve both expanding your repertoire of what feels pleasurable or meaningful, and developing a more compassionate relationship with difficulty and imperfection in sexual experience."
        : sexual_flexibility.label === "High sexual flexibility"
          ? "Your responses suggest high sexual flexibility. You appear relatively able to adapt to changes, differences, or disruptions in sexual experiences without those challenges fully undermining your sense of sexual wellbeing. This is a valuable quality, as sexual experiences inevitably change across the lifespan due to health, relationships, stress, and ageing. High flexibility means you are better positioned to maintain a positive relationship with sexuality even during challenging periods, which is a meaningful strength in your overall profile."
          : null,

  sexual_desire_label: sexual_function.desire.label,
  sfunc_desire_text:
    sexual_function.desire.label === "Lower"
      ? "Your responses suggest that sexual desire may currently be lower. This can reflect many different influences, including stress, mood, physical health, relationship context, hormonal factors, or simply where you are in life at the moment. Low desire is one of the most commonly reported sexual concerns and does not necessarily indicate a permanent problem; context matters enormously. It is worth reflecting on whether desire has changed recently or has always been lower, and whether there are particular circumstances in which it tends to increase or decrease, as this information can be very useful in understanding what might help."
      : sexual_function.desire.label === "Moderate"
        ? "Your responses suggest a moderate level of sexual desire. Desire may be present but variable, more context-dependent, or more responsive to emotional connection, stress levels, or physical factors than you might prefer. This is a very common experience given that for many people, desire is not spontaneous but rather responsive, meaning it tends to emerge in the right circumstances rather than arising on its own. Understanding the conditions under which desire tends to increase for you can be a helpful and empowering starting point."
        : sexual_function.desire.label === "Higher"
          ? "Your responses suggest relatively strong sexual desire. Desire does not appear to be a major area of difficulty at present, which is a positive feature of your overall sexual wellbeing profile. It is worth noting that desire exists on a spectrum and varies naturally across time, relationships, and life circumstances, but at this point in time, it appears to be a relative strength."
          : null,

  sexual_arousal_label: sexual_function.arousal.label,
  sfunc_arousal_text:
    sexual_function.arousal.label === "Lower"
      ? "Your responses suggest that arousal may currently be more difficult or less reliable. This can be shaped by stress, anxiety, physical factors, relationship dynamics, medication, and how safe or present you feel in sexual situations. Arousal difficulties are very common and are rarely caused by a single factor but usually reflect a combination of physical, psychological, and relational influences. It can be helpful to pay attention to the circumstances in which arousal feels easier or harder, as this often reveals useful patterns. If arousal difficulties are persistent or distressing, speaking with a GP or sexual health clinician is a worthwhile step."
      : sexual_function.arousal.label === "Moderate"
        ? "Your responses suggest a moderate arousal profile. Arousal may be present but somewhat variable, inconsistent, or more dependent on particular conditions such as emotional safety, low stress, or specific types of stimulation. This is a very common experience and does not necessarily indicate a dysfunction, arousal is highly sensitive to context and tends to fluctuate naturally. Becoming more attuned to what supports arousal for you specifically, and reducing performance pressure where possible, can make a meaningful difference."
        : sexual_function.arousal.label === "Higher"
          ? "Your responses suggest relatively good sexual arousal functioning. Arousal does not appear to be a major concern at this time, which is a positive indicator within your overall sexual function profile. Maintaining the conditions that support arousal, including emotional safety, manageable stress levels, and physical health, will help sustain this over time."
          : null,

  orgasm_label: sexual_function.orgasm.label,
  sfunc_orgasm_text:
    sexual_function.orgasm.label === "Lower"
      ? "Your responses suggest that orgasm may currently be more difficult, less satisfying, or less consistent. This can be influenced by physical, emotional, relational, and contextual factors rather than any single cause. Orgasm difficulties are among the most commonly reported sexual concerns and are frequently connected to anxiety, distraction, insufficient stimulation, or pressure to perform or respond in a particular way. It is worth approaching this area with curiosity rather than judgement, as self-criticism and performance pressure tend to make things harder. If this is a persistent concern, speaking with a clinician who specialises in sexual health can provide tailored guidance."
      : sexual_function.orgasm.label === "Moderate"
        ? "Your responses suggest a moderate orgasm profile. Orgasm may be achievable in some situations but less consistent, less easy, or less satisfying in others. This kind of variability is common and often reflects the influence of context, stress, relationship quality, or the type and duration of stimulation involved. Understanding the conditions under which orgasm tends to be more or less accessible can be a useful starting point for improving this aspect of sexual experience."
        : sexual_function.orgasm.label === "Higher"
          ? "Your responses suggest relatively good orgasm functioning. This does not appear to be a major source of difficulty at present, which is a positive feature of your sexual function profile. Orgasm experience can still vary naturally with mood, fatigue, stress, and relational context, but overall this appears to be a relative strength in your current sexual wellbeing."
          : null,

  pain_label: sexual_function.pain.label,
  sfunc_pain_text:
    sexual_function.pain.label === "Higher"
      ? "Your responses suggest that pain or physical discomfort may be a significant concern in sexual experiences. This is important information and deserves proper attention as persistent sexual pain is not something you should simply push through or accept as inevitable. Pain during sexual activity can have many causes, including physical, muscular, hormonal, and psychological factors, and it is often very treatable with the right support. We would strongly encourage you to speak with a GP, gynaecologist, pelvic floor physiotherapist, or sexual health clinician who can help identify what is contributing and what options are available."
      : sexual_function.pain.label === "Moderate"
        ? "Your responses suggest some degree of pain or discomfort may be present in sexual experiences, though not necessarily as a constant or overwhelming problem. Even intermittent pain during sexual activity is worth taking seriously, as it can affect desire, arousal, and the ability to be fully present and comfortable during intimacy. It is worth discussing this with a healthcare professional, as there are often effective interventions available depending on the cause."
        : sexual_function.pain.label === "Lower"
          ? "Your responses suggest that pain or physical discomfort is not a major concern in your current sexual functioning. This is a positive indicator, as physical comfort during sexual activity is an important foundation for pleasure, presence, and overall sexual wellbeing. It is still worth remaining attentive to any changes in this area over time, particularly in response to health changes, hormonal shifts, or new relational contexts."
          : null,

  satisfaction_label: sexual_function.satisfaction.label,
  sfunc_sat_text:
    sexual_function.satisfaction.label === "Lower"
      ? "Your responses suggest lower sexual satisfaction. This may reflect a mismatch between what you want from sexual experiences and what currently feels possible, enjoyable, or fulfilling. Sexual satisfaction is shaped by a wide range of factors including desire, connection, communication, body image, self-efficacy, and the broader relational and emotional context — so lower satisfaction is rarely due to one thing alone. Understanding which aspects of your sexual experience feel most unsatisfying can be a helpful way to identify where change might be most meaningful. This is also an area where working with a sex-positive clinician can provide tailored and effective support."
      : sexual_function.satisfaction.label === "Moderate"
        ? "Your responses suggest a moderate level of sexual satisfaction. Some aspects of your sexual experiences may feel positive and enjoyable, while others may feel less settled, less connected, or less fulfilling than you would like. This kind of mixed profile is common and often reflects the natural complexity of sexual experience across different periods of life. Reflecting on what tends to make sexual experiences more or less satisfying — and communicating this with a partner where relevant — can be a useful starting point for improvement."
        : sexual_function.satisfaction.label === "Higher"
          ? "Your responses suggest relatively good sexual satisfaction. Sexual experiences appear to be broadly fulfilling, enjoyable, or workable at present, which is a meaningful indicator of overall sexual wellbeing. Sexual satisfaction is one of the stronger predictors of relationship quality and general life satisfaction, so this is a genuine asset worth recognising and protecting through continued communication, openness, and care for the broader conditions that support it."
          : null,

  natsal_sf_label: natsal_sf.label,
  natsal_sf_text:
    natsal_sf.label === "Good sexual function"
      ? "Your responses suggest relatively good overall sexual function across the broader areas assessed. Difficulties do not appear to be prominent or distressing at this time, which is a positive indicator within your sexual wellbeing profile. Good sexual function provides a foundation for pleasure, intimacy, and connection, and tends to be supported by broader factors such as emotional health, relationship quality, and physical wellbeing. Continuing to attend to these areas will help sustain this over time."
      : natsal_sf.label === "Lowered sexual function"
        ? "Your responses suggest some lowered sexual function overall. There may be a small number of difficulties that are noticeable and relevant, even if they do not feel pervasive or overwhelming. It is worth paying attention to these areas, as sexual function difficulties that are caught early are generally easier to address than those that have been present for a longer time. Reflecting on the specific areas where functioning feels less strong — and what tends to influence them — can be a useful starting point."
        : natsal_sf.label === "Difficulties in sexual function"
          ? "Your responses suggest difficulties in sexual function across a number of the areas assessed. These concerns may be affecting your sexual wellbeing in ways that are important to acknowledge, and they are likely to benefit from further support or discussion. Sexual function difficulties are extremely common and are rarely a sign of something being fundamentally wrong — they usually reflect the interplay of physical, psychological, relational, and contextual factors that can shift with the right support. Speaking with a clinician who has expertise in sexual health is a worthwhile step toward understanding what is contributing and what might help."
          : null,

  natsal_sw_label: natsal_sw.label,
  natsal_sw_text:
    natsal_sw.label === "Lower sexual wellbeing"
      ? "Your responses suggest lower overall sexual wellbeing. Sexual experiences or your relationship to sexuality may currently feel less comfortable, less positive, or less integrated into your broader sense of self and wellbeing. Sexual wellbeing is a broad and multifaceted domain, and lower scores can reflect many different things, including the impact of stress, health, relationship difficulties, past experiences, or simply a period of disconnection from this part of life. It is worth approaching this area with compassion rather than judgement, and considering whether there are specific dimensions where change might feel most meaningful or possible."
      : natsal_sw.label === "Moderate sexual wellbeing"
        ? "Your responses suggest a moderate level of sexual wellbeing. There may be a mix of strengths and difficulties in how sexuality currently fits into your life, your relationships, and your sense of self. This kind of mixed profile is common and reflects the reality that sexual wellbeing is rarely uniformly positive or negative — it tends to vary across different areas and at different points in life. Identifying the specific areas that feel most positive, and those that feel most in need of attention, can help focus where energy and support might be best directed."
        : natsal_sw.label === "Higher sexual wellbeing"
          ? "Your responses suggest relatively strong overall sexual wellbeing. Sexuality appears to be a reasonably positive, manageable, and integrated part of your current life and sense of self. This is a meaningful indicator of overall health and quality of life, and reflects a combination of personal, relational, and contextual factors that are currently working in your favour. It is worth continuing to invest in the things that support this — including open communication, self-awareness, emotional health, and a compassionate relationship with your own body and sexuality."
          : null
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

    // Brevo email
    let emailResult = null;
    try {
      if (demographics.email && pdfmonkey?.document?.id) {
        const readyDoc = await waitForPdfMonkeyDocument(pdfmonkey.document.id);
        emailResult = await sendEmailWithBrevo(
          demographics.email,
          demographics.name,
          readyDoc.download_url
        );
        console.log("EMAIL RESULT:", emailResult);

        await supabase
          .from('tokens')
          .update({ used: true })
          .eq('token', demographics.token);

        console.log("Token marked as used:", demographics.token);
      }
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);
    }

    const responseBody = {
      ...final,
      ai_summary,
      pdfmonkey,
      emailResult
    };

    return res.status(200).json(responseBody);
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return res.status(500).json({
      error: "Failed",
      message: error.message
    });
  }
}
