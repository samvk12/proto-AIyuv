import type { QuizQuestion, Symptom, DoshaType } from "./schema";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How would you describe your body frame?",
    category: "Physical Constitution",
    options: [
      { text: "Thin, light, and lean with prominent bones and joints", dosha: "vata" },
      { text: "Medium build with good muscle definition", dosha: "pitta" },
      { text: "Sturdy, broad, and well-developed with a tendency to gain weight", dosha: "kapha" },
    ],
  },
  {
    id: 2,
    question: "What is your skin typically like?",
    category: "Physical Constitution",
    options: [
      { text: "Dry, thin, rough, and prone to cracking", dosha: "vata" },
      { text: "Warm, soft, oily, and prone to redness or rashes", dosha: "pitta" },
      { text: "Thick, cool, smooth, and moist", dosha: "kapha" },
    ],
  },
  {
    id: 3,
    question: "How is your appetite and digestion?",
    category: "Digestion",
    options: [
      { text: "Irregular appetite, sometimes strong, sometimes weak", dosha: "vata" },
      { text: "Strong appetite, uncomfortable if meals are skipped", dosha: "pitta" },
      { text: "Steady but slow appetite, can skip meals easily", dosha: "kapha" },
    ],
  },
  {
    id: 4,
    question: "How do you typically sleep?",
    category: "Sleep Patterns",
    options: [
      { text: "Light sleeper, often wake up during the night", dosha: "vata" },
      { text: "Moderate, sound sleep but can wake if disturbed", dosha: "pitta" },
      { text: "Deep and long sleep, hard to wake up", dosha: "kapha" },
    ],
  },
  {
    id: 5,
    question: "What is your mental activity like?",
    category: "Mental Constitution",
    options: [
      { text: "Quick thinking, creative, but restless mind", dosha: "vata" },
      { text: "Sharp, analytical, focused and goal-oriented", dosha: "pitta" },
      { text: "Calm, steady, good memory, slow to learn but retentive", dosha: "kapha" },
    ],
  },
  {
    id: 6,
    question: "How do you handle stress?",
    category: "Emotional Response",
    options: [
      { text: "Become anxious, worried, or fearful", dosha: "vata" },
      { text: "Become irritable, critical, or aggressive", dosha: "pitta" },
      { text: "Become withdrawn, stubborn, or depressed", dosha: "kapha" },
    ],
  },
  {
    id: 7,
    question: "What weather conditions do you prefer?",
    category: "Environmental Preferences",
    options: [
      { text: "Prefer warm, humid weather; dislike cold and wind", dosha: "vata" },
      { text: "Prefer cool weather; dislike heat and humidity", dosha: "pitta" },
      { text: "Prefer warm, dry weather; dislike cold and damp", dosha: "kapha" },
    ],
  },
  {
    id: 8,
    question: "How would you describe your energy levels?",
    category: "Energy",
    options: [
      { text: "Energy comes in bursts, tire easily, need rest often", dosha: "vata" },
      { text: "Moderate energy, can push through when motivated", dosha: "pitta" },
      { text: "Steady endurance, slow to start but can go for long", dosha: "kapha" },
    ],
  },
  {
    id: 9,
    question: "What is your natural speaking style?",
    category: "Communication",
    options: [
      { text: "Fast, talkative, sometimes rambling or inconsistent", dosha: "vata" },
      { text: "Sharp, precise, clear, sometimes argumentative", dosha: "pitta" },
      { text: "Slow, melodious, thoughtful, sometimes monotonous", dosha: "kapha" },
    ],
  },
  {
    id: 10,
    question: "How do you approach making decisions?",
    category: "Decision Making",
    options: [
      { text: "Quick to decide but may change mind often", dosha: "vata" },
      { text: "Decisive and confident, rarely second-guess", dosha: "pitta" },
      { text: "Take time to deliberate, steady once decided", dosha: "kapha" },
    ],
  },
];

export const symptoms: Symptom[] = [
  { id: 1, name: "Anxiety or restlessness", category: "Mental" },
  { id: 2, name: "Dry skin or hair", category: "Skin" },
  { id: 3, name: "Constipation", category: "Digestive" },
  { id: 4, name: "Joint pain or stiffness", category: "Physical" },
  { id: 5, name: "Insomnia or disturbed sleep", category: "Sleep" },
  { id: 6, name: "Cold hands and feet", category: "Circulation" },
  { id: 7, name: "Bloating or gas", category: "Digestive" },
  { id: 8, name: "Irregular appetite", category: "Digestive" },
  { id: 9, name: "Heartburn or acid reflux", category: "Digestive" },
  { id: 10, name: "Skin rashes or inflammation", category: "Skin" },
  { id: 11, name: "Irritability or anger", category: "Mental" },
  { id: 12, name: "Excessive sweating", category: "Physical" },
  { id: 13, name: "Burning sensation in body", category: "Physical" },
  { id: 14, name: "Loose stools or diarrhea", category: "Digestive" },
  { id: 15, name: "Eye sensitivity or redness", category: "Eyes" },
  { id: 16, name: "Weight gain or difficulty losing weight", category: "Metabolism" },
  { id: 17, name: "Congestion or mucus buildup", category: "Respiratory" },
  { id: 18, name: "Feeling sluggish or lethargic", category: "Energy" },
  { id: 19, name: "Water retention or swelling", category: "Circulation" },
  { id: 20, name: "Excessive sleep or drowsiness", category: "Sleep" },
  { id: 21, name: "Loss of appetite", category: "Digestive" },
  { id: 22, name: "Depression or sadness", category: "Mental" },
];

export interface DoshaDescription {
  title: string;
  element: string;
  qualities: string;
  description: string;
  characteristics: string[];
  recommendations: {
    diet: string[];
    lifestyle: string[];
    exercise: string[];
    herbs: string[];
  };
}

export const doshaDescriptions: Record<DoshaType, DoshaDescription> = {
  vata: {
    title: "Vata Dosha",
    element: "Air & Space",
    qualities: "Light, dry, cold, rough, subtle, mobile, clear",
    description: "Vata governs all movement in the body and mind. People with dominant Vata are creative, energetic, and quick-thinking. When balanced, they are enthusiastic and lively. When imbalanced, they may experience anxiety, dryness, and irregular digestion.",
    characteristics: [
      "Creative and imaginative mind",
      "Quick to learn, quick to forget",
      "Enthusiastic and vivacious",
      "Thin and light body frame",
      "Variable appetite and digestion",
      "Light and interrupted sleep",
      "Tendency toward dry skin and hair",
    ],
    recommendations: {
      diet: [
        "Favor warm, cooked, nourishing foods",
        "Include healthy oils like ghee and sesame",
        "Eat sweet, sour, and salty tastes",
        "Avoid raw, cold, and dry foods",
        "Drink warm water and herbal teas",
      ],
      lifestyle: [
        "Maintain regular daily routines",
        "Get adequate rest and sleep",
        "Practice oil massage (Abhyanga)",
        "Stay warm and avoid cold, windy environments",
        "Create a calm, peaceful environment",
      ],
      exercise: [
        "Gentle yoga and stretching",
        "Walking in nature",
        "Swimming in warm water",
        "Tai Chi or Qigong",
        "Avoid excessive cardio",
      ],
      herbs: [
        "Ashwagandha for grounding",
        "Triphala for digestion",
        "Brahmi for mental calm",
        "Ginger for warmth",
        "Licorice root for nourishment",
      ],
    },
  },
  pitta: {
    title: "Pitta Dosha",
    element: "Fire & Water",
    qualities: "Hot, sharp, light, liquid, oily, spreading",
    description: "Pitta governs transformation, metabolism, and digestion. People with dominant Pitta are intelligent, focused, and natural leaders. When balanced, they are warm and joyful. When imbalanced, they may experience inflammation, anger, and digestive issues.",
    characteristics: [
      "Sharp intellect and good concentration",
      "Natural leadership abilities",
      "Strong digestion and metabolism",
      "Medium, athletic build",
      "Warm body temperature",
      "Sound, moderate sleep",
      "Tendency toward oily, sensitive skin",
    ],
    recommendations: {
      diet: [
        "Favor cooling, refreshing foods",
        "Include sweet, bitter, and astringent tastes",
        "Eat plenty of fresh vegetables and fruits",
        "Avoid spicy, sour, and fried foods",
        "Drink room temperature or cool water",
      ],
      lifestyle: [
        "Avoid excessive heat and sun exposure",
        "Take breaks during intense work",
        "Practice moderation in all activities",
        "Spend time in nature near water",
        "Cultivate patience and compassion",
      ],
      exercise: [
        "Swimming and water sports",
        "Moderate yoga practice",
        "Hiking in cool weather",
        "Team sports with friendly competition",
        "Avoid exercising in midday heat",
      ],
      herbs: [
        "Amalaki for cooling and rejuvenation",
        "Neem for purification",
        "Brahmi for mental coolness",
        "Shatavari for nourishment",
        "Coriander for digestion",
      ],
    },
  },
  kapha: {
    title: "Kapha Dosha",
    element: "Earth & Water",
    qualities: "Heavy, slow, cool, oily, smooth, dense, soft, stable",
    description: "Kapha provides structure, stability, and lubrication. People with dominant Kapha are calm, loving, and grounded. When balanced, they are strong and compassionate. When imbalanced, they may experience weight gain, congestion, and lethargy.",
    characteristics: [
      "Calm and steady temperament",
      "Excellent long-term memory",
      "Loyal and compassionate nature",
      "Strong, sturdy body frame",
      "Slow but steady metabolism",
      "Deep and prolonged sleep",
      "Smooth, lustrous skin and thick hair",
    ],
    recommendations: {
      diet: [
        "Favor light, warm, and stimulating foods",
        "Include pungent, bitter, and astringent tastes",
        "Eat plenty of vegetables and legumes",
        "Minimize heavy, oily, and sweet foods",
        "Drink warm or hot beverages",
      ],
      lifestyle: [
        "Wake up early and stay active",
        "Embrace variety and new experiences",
        "Avoid daytime napping",
        "Keep living spaces bright and warm",
        "Engage in regular stimulating activities",
      ],
      exercise: [
        "Vigorous aerobic exercise",
        "Running or jogging",
        "Dynamic yoga styles like Vinyasa",
        "Dancing and martial arts",
        "Exercise regularly, especially in morning",
      ],
      herbs: [
        "Trikatu for metabolism",
        "Guggulu for weight management",
        "Tulsi for respiratory health",
        "Punarnava for water balance",
        "Ginger and black pepper for digestion",
      ],
    },
  },
};
