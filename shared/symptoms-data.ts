import type { Symptom, DoshaType } from "./schema";

export interface SymptomQuestion {
  id: string;
  text: string;
  options: { label: string; score: number }[];
}

// ========================
// SYMPTOM DATABASE
// Reference: Spec Section 3 - Symptom Input Layer
// ========================

export const symptoms: Symptom[] = [
  // Vata-related symptoms
  { id: 1, name: "Fatigue / Low energy", category: "Energy", relatedDosha: "vata" },
  { id: 2, name: "Anxiety / Nervousness", category: "Mental", relatedDosha: "vata" },
  { id: 3, name: "Difficulty sleeping", category: "Sleep", relatedDosha: "vata" },
  { id: 4, name: "Dry skin", category: "Skin", relatedDosha: "vata" },
  { id: 5, name: "Constipation", category: "Digestive", relatedDosha: "vata" },
  { id: 6, name: "Joint pain / Stiffness", category: "Physical", relatedDosha: "vata" },
  { id: 7, name: "Cold hands / feet", category: "Physical", relatedDosha: "vata" },
  { id: 8, name: "Racing thoughts", category: "Mental", relatedDosha: "vata" },
  
  // Pitta-related symptoms
  { id: 9, name: "Skin rashes / Inflammation", category: "Skin", relatedDosha: "pitta" },
  { id: 10, name: "Heartburn / Acid reflux", category: "Digestive", relatedDosha: "pitta" },
  { id: 11, name: "Irritability / Anger", category: "Mental", relatedDosha: "pitta" },
  { id: 12, name: "Excessive sweating", category: "Physical", relatedDosha: "pitta" },
  { id: 13, name: "Loose stools / Diarrhea", category: "Digestive", relatedDosha: "pitta" },
  { id: 14, name: "Eye irritation", category: "Physical", relatedDosha: "pitta" },
  { id: 15, name: "Feeling overheated", category: "Physical", relatedDosha: "pitta" },
  { id: 16, name: "Skin sensitivity", category: "Skin", relatedDosha: "pitta" },
  
  // Kapha-related symptoms
  { id: 17, name: "Weight gain / Sluggishness", category: "Physical", relatedDosha: "kapha" },
  { id: 18, name: "Congestion / Excess mucus", category: "Respiratory", relatedDosha: "kapha" },
  { id: 19, name: "Lethargy / Low motivation", category: "Mental", relatedDosha: "kapha" },
  { id: 20, name: "Water retention / Swelling", category: "Physical", relatedDosha: "kapha" },
  { id: 21, name: "Heavy feeling after meals", category: "Digestive", relatedDosha: "kapha" },
  { id: 22, name: "Oily skin", category: "Skin", relatedDosha: "kapha" },
  { id: 23, name: "Oversleeping", category: "Sleep", relatedDosha: "kapha" },
  { id: 24, name: "Lack of appetite", category: "Digestive", relatedDosha: "kapha" },
];

export const symptomSpecificQuestions: Record<string, SymptomQuestion[]> = {
  "Digestive": [
    {
      id: "dig_1",
      text: "Is there a burning sensation in the stomach?",
      options: [{ label: "No", score: 0 }, { label: "Occasional", score: 1 }, { label: "Frequent/Severe", score: 3 }]
    },
    {
      id: "dig_2",
      text: "Is the discomfort related to specific types of food?",
      options: [{ label: "No", score: 0 }, { label: "Yes, spicy/oily", score: 1 }, { label: "Yes, almost everything", score: 2 }]
    }
  ],
  "Mental": [
    {
      id: "men_1",
      text: "Does the anxiety interfere with your daily tasks?",
      options: [{ label: "Not at all", score: 0 }, { label: "Somewhat", score: 2 }, { label: "Completely", score: 4 }]
    },
    {
      id: "men_2",
      text: "How often do you experience these thoughts?",
      options: [{ label: "Rarely", score: 0 }, { label: "Daily", score: 2 }, { label: "Multiple times a day", score: 3 }]
    }
  ],
  "Energy": [
    {
      id: "en_1",
      text: "Do you feel rested after a full night's sleep?",
      options: [{ label: "Yes", score: 0 }, { label: "Sometimes", score: 1 }, { label: "Never", score: 3 }]
    },
    {
      id: "en_2",
      text: "Does the fatigue worsen after physical activity?",
      options: [{ label: "No", score: 0 }, { label: "Slightly", score: 1 }, { label: "Significantly", score: 2 }]
    }
  ],
  "Respiratory": [
    {
      id: "res_1",
      text: "Is there difficulty in breathing or shortness of breath?",
      options: [{ label: "No", score: 0 }, { label: "Only during exertion", score: 2 }, { label: "Even at rest", score: 5 }]
    },
    {
      id: "res_2",
      text: "Is the congestion accompanied by a persistent cough?",
      options: [{ label: "No", score: 0 }, { label: "Dry cough", score: 1 }, { label: "Productive/Heavy cough", score: 3 }]
    }
  ],
  "Physical": [
    {
      id: "phy_1",
      text: "Is there visible swelling or redness in the area?",
      options: [{ label: "No", score: 0 }, { label: "Mild swelling", score: 2 }, { label: "Severe inflammation", score: 4 }]
    },
    {
      id: "phy_2",
      text: "Does the pain restrict your range of motion?",
      options: [{ label: "No", score: 0 }, { label: "Partially", score: 2 }, { label: "Significantly", score: 3 }]
    }
  ],
  "Skin": [
    {
      id: "ski_1",
      text: "Is the skin area painful or itchy?",
      options: [{ label: "Neither", score: 0 }, { label: "Itchy", score: 1 }, { label: "Painful/Burning", score: 3 }]
    },
    {
      id: "ski_2",
      text: "Is the condition spreading to other parts of the body?",
      options: [{ label: "No", score: 0 }, { label: "Slowly", score: 2 }, { label: "Rapidly", score: 4 }]
    }
  ]
};

// Get symptoms by category
export function getSymptomsByCategory(): Record<string, Symptom[]> {
  const grouped: Record<string, Symptom[]> = {};
  symptoms.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });
  return grouped;
}

// Get symptoms by dosha
export function getSymptomsByDosha(dosha: DoshaType): Symptom[] {
  return symptoms.filter(s => s.relatedDosha === dosha);
}

// Get symptom by ID
export function getSymptomById(id: number): Symptom | undefined {
  return symptoms.find(s => s.id === id);
}

// Check if symptom is skin-related
export function isSkinSymptom(symptomId: number): boolean {
  const symptom = getSymptomById(symptomId);
  return symptom?.category === "Skin";
}

// Check if symptom is digestive-related
export function isDigestiveSymptom(symptomId: number): boolean {
  const symptom = getSymptomById(symptomId);
  return symptom?.category === "Digestive";
}
