import type { Symptom, DoshaType } from "./schema";

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
