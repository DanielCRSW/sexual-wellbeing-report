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
  sexual_satisfaction: "question_QAyVk7",

  // problem checklist
  problems: {
    low_desire: "question_9d5QMQ",
    low_desire_distress: "question_eBPRve",
    arousal: "question_WAdz1N",
    arousal_distress: "question_aBodvB",
    orgasm: "question_6d5NMk",
    orgasm_distress: "question_7d5xMZ",
    pain: "question_blGdvL",
    pain_distress: "question_Al5vyD",
    anxiety: "question_BG570Q",
    anxiety_distress: "question_kYxEvR",
    disconnection: "question_vNbYK0",
    disconnection_distress: "question_KMy1k8",
    desire_mismatch: "question_Ldypkv",
    desire_mismatch_distress: "question_pL9OvJ",
    avoidance: "question_1r5V6p",
    avoidance_distress: "question_MAyRMM",
    sexuality_distress: "question_J2YzMo",
    sexuality_distress_level: "question_g5rGvO",
    negative_impact: "question_ylkYzg",
    negative_impact_distress: "question_Xey0zg"
  }
};

const getField = (fields, key) =>
  fields.find((f) => f.key === key);

const getSelectedOptionText = (field) => {
  if (!field || !field.value || !field.options) return null;
  const selectedId = Array.isArray(field.value) ? field.value[0] : field.value;
  const selectedOption = field.options.find((opt) => opt.id === selectedId);
  return selectedOption ? selectedOption.text : null;
};

export default async function handler(req, res) {
  try {
    const fields = req.body.data.fields;

    const age = getField(fields, FIELD_KEYS.age)?.value;
    const genderField = getField(fields, FIELD_KEYS.gender);
    const gender = getSelectedOptionText(genderField);

    console.log("AGE:", age);
    console.log("GENDER TEXT:", gender);

    return res.status(200).json({
      age,
      gender
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
}
