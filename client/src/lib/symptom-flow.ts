export type DoshaType = "vata" | "pitta" | "kapha";

export type SeverityLevel = "Mild" | "Moderate" | "High";

export interface SeverityOption {
  label: string;
  score: number; // 1 = Mild, 2 = Moderate, 3 = High
}

export interface SeverityQuestion {
  id: string;
  text: string;
  options: SeverityOption[];
}

export interface SymptomDefinition {
  id: string;
  label: string;
  dosha: DoshaType;
  description: string;
  questions: SeverityQuestion[];
}

export const symptomDefinitions: SymptomDefinition[] = [
  // Vata-linked symptoms
  {
    id: "dry_skin",
    label: "Dry Skin",
    dosha: "vata",
    description: "Rough, dry or flaky skin on face or body.",
    questions: [
      {
        id: "dry_skin_area",
        text: "How widespread is the dryness?",
        options: [
          { label: "Small patches", score: 1 },
          { label: "Face or hands only", score: 2 },
          { label: "Multiple body areas", score: 3 },
        ],
      },
      {
        id: "dry_skin_duration",
        text: "How long has this dryness been present?",
        options: [
          { label: "Less than 2 weeks", score: 1 },
          { label: "2–8 weeks", score: 2 },
          { label: "More than 2 months", score: 3 },
        ],
      },
    ],
  },
  {
    id: "insomnia",
    label: "Insomnia / Restless Sleep",
    dosha: "vata",
    description: "Difficulty falling or staying asleep.",
    questions: [
      {
        id: "insomnia_frequency",
        text: "How often do you have trouble sleeping?",
        options: [
          { label: "1–2 nights a week", score: 1 },
          { label: "3–4 nights a week", score: 2 },
          { label: "Most nights", score: 3 },
        ],
      },
      {
        id: "insomnia_impact",
        text: "How much does this affect your daytime energy?",
        options: [
          { label: "Barely noticeable", score: 1 },
          { label: "Somewhat tired", score: 2 },
          { label: "Very exhausted", score: 3 },
        ],
      },
    ],
  },
  {
    id: "constipation",
    label: "Constipation",
    dosha: "vata",
    description: "Hard stools or infrequent bowel movements.",
    questions: [
      {
        id: "constipation_frequency",
        text: "How often do you feel constipated?",
        options: [
          { label: "Once in a while", score: 1 },
          { label: "A few times a week", score: 2 },
          { label: "Almost every day", score: 3 },
        ],
      },
      {
        id: "constipation_discomfort",
        text: "How uncomfortable or painful is it?",
        options: [
          { label: "Mild discomfort", score: 1 },
          { label: "Moderate discomfort", score: 2 },
          { label: "Severe pain or bloating", score: 3 },
        ],
      },
    ],
  },

  // Pitta-linked symptoms
  {
    id: "acid_reflux",
    label: "Acid Reflux / Heartburn",
    dosha: "pitta",
    description: "Burning sensation in chest or throat after meals.",
    questions: [
      {
        id: "reflux_frequency",
        text: "How often do you experience acid reflux?",
        options: [
          { label: "Occasionally (1–2 times a week)", score: 1 },
          { label: "Frequently (3–5 times a week)", score: 2 },
          { label: "Daily or after most meals", score: 3 },
        ],
      },
      {
        id: "reflux_pain",
        text: "How intense is the burning or pain?",
        options: [
          { label: "Mild burning", score: 1 },
          { label: "Moderate burning", score: 2 },
          { label: "Severe burning / pain", score: 3 },
        ],
      },
    ],
  },
  {
    id: "acne",
    label: "Acne / Skin Inflammation",
    dosha: "pitta",
    description: "Red, inflamed pimples or breakouts.",
    questions: [
      {
        id: "acne_spread",
        text: "How large is the affected area?",
        options: [
          { label: "Few small spots", score: 1 },
          { label: "Multiple areas on face", score: 2 },
          { label: "Face plus back / chest", score: 3 },
        ],
      },
      {
        id: "acne_pain",
        text: "How painful or tender are the pimples?",
        options: [
          { label: "Not painful", score: 1 },
          { label: "Sometimes painful", score: 2 },
          { label: "Frequently painful", score: 3 },
        ],
      },
    ],
  },
  {
    id: "irritability",
    label: "Irritability / Anger",
    dosha: "pitta",
    description: "Feeling easily irritated, impatient or angry.",
    questions: [
      {
        id: "anger_triggers",
        text: "How easily do small events trigger anger?",
        options: [
          { label: "Rarely", score: 1 },
          { label: "Sometimes", score: 2 },
          { label: "Very easily", score: 3 },
        ],
      },
      {
        id: "anger_duration",
        text: "How long do these feelings last?",
        options: [
          { label: "A few minutes", score: 1 },
          { label: "Up to an hour", score: 2 },
          { label: "Many hours / full day", score: 3 },
        ],
      },
    ],
  },

  // Kapha-linked symptoms
  {
    id: "lethargy",
    label: "Lethargy / Heaviness",
    dosha: "kapha",
    description: "Feeling heavy, slow, or low motivation.",
    questions: [
      {
        id: "lethargy_morning",
        text: "How heavy or slow do you feel in the morning?",
        options: [
          { label: "Slightly heavy, then normal", score: 1 },
          { label: "Heavy for a few hours", score: 2 },
          { label: "Heavy most of the day", score: 3 },
        ],
      },
      {
        id: "lethargy_activity",
        text: "How hard is it to start physical activity?",
        options: [
          { label: "Easy once I begin", score: 1 },
          { label: "Takes effort to begin", score: 2 },
          { label: "Very difficult to start moving", score: 3 },
        ],
      },
    ],
  },
  {
    id: "congestion",
    label: "Nasal / Chest Congestion",
    dosha: "kapha",
    description: "Mucus buildup, stuffy nose, or chest congestion.",
    questions: [
      {
        id: "congestion_frequency",
        text: "How often do you feel congested?",
        options: [
          { label: "Only with colds", score: 1 },
          { label: "Frequently in mornings", score: 2 },
          { label: "Most of the day", score: 3 },
        ],
      },
      {
        id: "congestion_breathing",
        text: "How much does congestion affect breathing?",
        options: [
          { label: "Barely noticeable", score: 1 },
          { label: "Sometimes harder to breathe", score: 2 },
          { label: "Often quite difficult", score: 3 },
        ],
      },
    ],
  },
  {
    id: "water_retention",
    label: "Fluid Retention / Swelling",
    dosha: "kapha",
    description: "Puffiness, swelling or fluid retention in body.",
    questions: [
      {
        id: "swelling_area",
        text: "Where do you notice swelling the most?",
        options: [
          { label: "Occasionally in feet or hands", score: 1 },
          { label: "Regularly in feet / ankles", score: 2 },
          { label: "Multiple areas (face, hands, legs)", score: 3 },
        ],
      },
      {
        id: "swelling_duration",
        text: "How long does the swelling last?",
        options: [
          { label: "Less than a day", score: 1 },
          { label: "A few days", score: 2 },
          { label: "Weeks or more", score: 3 },
        ],
      },
    ],
  },
];

export function getSymptomById(id: string): SymptomDefinition | undefined {
  return symptomDefinitions.find((s) => s.id === id);
}

export function calculateDoshaBalance(
  selections: { symptomId: string; averageScore: number }[],
): { vata: number; pitta: number; kapha: number } {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  selections.forEach(({ symptomId, averageScore }) => {
    const symptom = getSymptomById(symptomId);
    if (!symptom) return;
    if (symptom.dosha === "vata") vata += averageScore;
    if (symptom.dosha === "pitta") pitta += averageScore;
    if (symptom.dosha === "kapha") kapha += averageScore;
  });

  const total = vata + pitta + kapha || 1;

  return {
    vata: Math.round((vata / total) * 100),
    pitta: Math.round((pitta / total) * 100),
    kapha: Math.round((kapha / total) * 100),
  };
}

export function calculateOverallSeverity(averageScore: number): SeverityLevel {
  if (averageScore <= 1.5) return "Mild";
  if (averageScore <= 2.3) return "Moderate";
  return "High";
}

