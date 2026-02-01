import type { DoshaType, PreventiveGuidance, MedicalAwareness } from "./schema";

// ========================
// PREVENTIVE GUIDANCE DATABASE
// Reference: Spec Section 7 - Output to User
// NOTE: These are lifestyle suggestions, NOT prescriptions
// ========================

export const doshaGuidance: Record<DoshaType, PreventiveGuidance> = {
  vata: {
    habits: [
      "Maintain a regular daily routine with consistent meal and sleep times",
      "Practice gentle, grounding exercises like yoga or walking",
      "Avoid excessive cold, wind, and dry environments",
      "Take warm baths with calming essential oils",
      "Practice meditation or deep breathing for 10-15 minutes daily",
    ],
    foodPreferences: [
      "Favor warm, cooked foods over raw or cold foods",
      "Include healthy fats like ghee and sesame oil",
      "Choose sweet, sour, and salty tastes",
      "Eat warm soups, stews, and grains",
      "Stay well-hydrated with warm water and herbal teas",
    ],
    sleepTips: [
      "Go to bed by 10 PM and wake at a consistent time",
      "Create a calm, quiet sleeping environment",
      "Avoid stimulating activities before bed",
      "Apply warm sesame oil to feet before sleep",
      "Practice relaxation techniques before bed",
    ],
    stressTips: [
      "Practice grounding exercises when feeling anxious",
      "Limit multitasking and focus on one thing at a time",
      "Spend time in nature, especially near water",
      "Maintain social connections with supportive people",
      "Avoid over-scheduling and allow for rest",
    ],
    activityTips: [
      "Choose gentle, low-impact exercises",
      "Practice yoga with slow, mindful movements",
      "Avoid excessive cardio or high-intensity workouts",
      "Include stretching and flexibility exercises",
      "Exercise at the same time each day",
    ],
  },
  pitta: {
    habits: [
      "Stay cool and avoid overheating",
      "Take breaks during intense work periods",
      "Practice moderation in all activities",
      "Spend time in nature, especially near water",
      "Avoid excessive competition and perfectionism",
    ],
    foodPreferences: [
      "Favor cooling foods like cucumbers, melons, and leafy greens",
      "Choose sweet, bitter, and astringent tastes",
      "Avoid spicy, oily, and fried foods",
      "Eat at regular intervals without skipping meals",
      "Include cooling herbs like coriander and mint",
    ],
    sleepTips: [
      "Keep bedroom cool and well-ventilated",
      "Avoid working or screens close to bedtime",
      "Go to bed before 10 PM to avoid second wind",
      "Use cooling colors in the bedroom",
      "Practice calming activities before sleep",
    ],
    stressTips: [
      "Practice cooling breathing exercises",
      "Channel competitive energy into positive outlets",
      "Learn to delegate and let go of control",
      "Take regular breaks from intense work",
      "Practice forgiveness and letting go of anger",
    ],
    activityTips: [
      "Exercise during cooler parts of the day",
      "Choose swimming or water-based activities",
      "Avoid exercising during peak sun hours",
      "Balance intense workouts with relaxation",
      "Practice yoga poses that promote cooling",
    ],
  },
  kapha: {
    habits: [
      "Rise early, ideally before 6 AM",
      "Maintain an active, stimulating daily routine",
      "Avoid daytime napping",
      "Seek variety and new experiences",
      "Declutter living and work spaces regularly",
    ],
    foodPreferences: [
      "Favor light, warm, and dry foods",
      "Choose pungent, bitter, and astringent tastes",
      "Reduce sweet, sour, and salty foods",
      "Avoid heavy, oily, and dairy-rich foods",
      "Include warming spices like ginger and black pepper",
    ],
    sleepTips: [
      "Wake up early, before sunrise if possible",
      "Avoid sleeping more than 7-8 hours",
      "Keep bedroom bright and stimulating in morning",
      "Avoid heavy meals close to bedtime",
      "Use invigorating scents in the morning",
    ],
    stressTips: [
      "Stay active and avoid prolonged sitting",
      "Seek new challenges and learning opportunities",
      "Maintain social connections and engage with others",
      "Set goals and work toward them consistently",
      "Practice energizing breathing exercises",
    ],
    activityTips: [
      "Engage in vigorous, stimulating exercise",
      "Try new and challenging physical activities",
      "Exercise in the morning for best results",
      "Include cardio and strength training",
      "Avoid sedentary activities for long periods",
    ],
  },
};

// Medical awareness content (always shown)
export const medicalAwareness: MedicalAwareness = {
  escalationAdvice: [
    "If symptoms persist or worsen after 2 weeks, consult a healthcare provider",
    "For sudden or severe symptoms, seek immediate medical attention",
    "Keep track of your symptoms and share with your healthcare provider",
  ],
  warningSignsToWatch: [
    "Sudden unexplained weight loss",
    "Persistent fever or night sweats",
    "Severe or worsening pain",
    "Difficulty breathing or chest pain",
    "Changes in consciousness or confusion",
  ],
  whenToSeekHelp: [
    "When symptoms significantly impact daily activities",
    "When home remedies provide no relief after a reasonable time",
    "When experiencing new or unusual symptoms",
    "When symptoms are accompanied by high fever",
    "When you feel something is seriously wrong",
  ],
};

// Disclaimer text (required by Spec Section 7)
export const DISCLAIMER = "This is not a medical diagnosis. The information provided is for educational and preventive wellness purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.";
