import type { Express } from "express";
import { createServer, type Server } from "http";
import { doshaDescriptions } from "@shared/quiz-data";
import { quizSubmissionSchema, symptomCheckSchema, type DoshaResult, type DoshaType, type SymptomAnalysis, type Remedy } from "@shared/schema";

// Symptom to dosha mapping
const symptomDoshaMapping: Record<number, DoshaType> = {
  // Vata symptoms (1-8)
  1: "vata",  // Anxiety or restlessness
  2: "vata",  // Dry skin or hair
  3: "vata",  // Constipation
  4: "vata",  // Joint pain or stiffness
  5: "vata",  // Insomnia or disturbed sleep
  6: "vata",  // Cold hands and feet
  7: "vata",  // Bloating or gas
  8: "vata",  // Irregular appetite
  // Pitta symptoms (9-15)
  9: "pitta",  // Heartburn or acid reflux
  10: "pitta", // Skin rashes or inflammation
  11: "pitta", // Irritability or anger
  12: "pitta", // Excessive sweating
  13: "pitta", // Burning sensation in body
  14: "pitta", // Loose stools or diarrhea
  15: "pitta", // Eye sensitivity or redness
  // Kapha symptoms (16-22)
  16: "kapha", // Weight gain or difficulty losing weight
  17: "kapha", // Congestion or mucus buildup
  18: "kapha", // Feeling sluggish or lethargic
  19: "kapha", // Water retention or swelling
  20: "kapha", // Excessive sleep or drowsiness
  21: "kapha", // Loss of appetite
  22: "kapha", // Depression or sadness
};

// Remedies database
const remedies: Record<DoshaType, Remedy[]> = {
  vata: [
    {
      id: 1,
      name: "Ashwagandha Milk",
      description: "A calming and grounding drink to reduce anxiety and improve sleep quality.",
      ingredients: ["Warm milk (dairy or plant-based)", "1/2 tsp Ashwagandha powder", "Pinch of nutmeg", "Honey to taste"],
      instructions: "Warm the milk, add ashwagandha and nutmeg, stir well. Drink 30 minutes before bed.",
      doshaBalance: { vata: -3, pitta: 0, kapha: 1 },
      benefits: ["Reduces anxiety", "Promotes restful sleep", "Calms the nervous system"],
    },
    {
      id: 2,
      name: "Sesame Oil Abhyanga",
      description: "Self-massage with warm sesame oil to nourish dry skin and calm the mind.",
      ingredients: ["1/4 cup warm sesame oil"],
      instructions: "Warm the oil, massage onto entire body using long strokes on limbs and circular motions on joints. Leave for 15-20 minutes before showering.",
      doshaBalance: { vata: -4, pitta: 1, kapha: 1 },
      benefits: ["Moisturizes dry skin", "Reduces joint stiffness", "Calms nervous system"],
    },
    {
      id: 3,
      name: "Triphala Tea",
      description: "A gentle digestive tonic to relieve constipation and improve gut health.",
      ingredients: ["1/2 tsp Triphala powder", "1 cup warm water"],
      instructions: "Add triphala to warm water, stir and drink before bed or upon waking. Can add honey for taste.",
      doshaBalance: { vata: -2, pitta: -1, kapha: -1 },
      benefits: ["Relieves constipation", "Detoxifies body", "Supports digestion"],
    },
  ],
  pitta: [
    {
      id: 4,
      name: "Cooling Aloe Vera Drink",
      description: "A refreshing drink to cool internal heat and soothe digestive inflammation.",
      ingredients: ["2 tbsp pure aloe vera gel", "1 cup coconut water", "Mint leaves", "A squeeze of lime"],
      instructions: "Blend all ingredients together. Drink on an empty stomach in the morning or between meals.",
      doshaBalance: { vata: 1, pitta: -4, kapha: 1 },
      benefits: ["Reduces acidity", "Cools inflammation", "Soothes digestive tract"],
    },
    {
      id: 5,
      name: "Rose Water Compress",
      description: "A cooling treatment for irritated skin and eyes.",
      ingredients: ["Pure rose water", "Soft cotton pads or cloth"],
      instructions: "Soak cotton pads in chilled rose water, place over closed eyes or irritated skin for 10-15 minutes.",
      doshaBalance: { vata: 0, pitta: -3, kapha: 0 },
      benefits: ["Cools and soothes skin", "Reduces eye irritation", "Calms inflammation"],
    },
    {
      id: 6,
      name: "Brahmi-Amalaki Tea",
      description: "A cooling herbal tea to calm the mind and reduce irritability.",
      ingredients: ["1/2 tsp Brahmi powder", "1/2 tsp Amalaki powder", "1 cup warm water", "Honey (optional)"],
      instructions: "Mix herbs in warm (not hot) water, steep for 5 minutes. Add honey if desired. Drink 1-2 times daily.",
      doshaBalance: { vata: 0, pitta: -3, kapha: 0 },
      benefits: ["Cools the mind", "Reduces anger", "Supports mental clarity"],
    },
  ],
  kapha: [
    {
      id: 7,
      name: "Ginger-Lemon Morning Tonic",
      description: "An invigorating drink to boost metabolism and clear congestion.",
      ingredients: ["1 inch fresh ginger (grated)", "Juice of 1/2 lemon", "1 cup warm water", "1 tsp raw honey"],
      instructions: "Add grated ginger to warm water, steep for 5 minutes. Strain, add lemon juice and honey. Drink first thing in the morning.",
      doshaBalance: { vata: 1, pitta: 1, kapha: -4 },
      benefits: ["Boosts metabolism", "Clears congestion", "Increases energy"],
    },
    {
      id: 8,
      name: "Trikatu Digestive Powder",
      description: "A warming spice blend to kindle digestive fire and reduce sluggishness.",
      ingredients: ["Equal parts: dried ginger, black pepper, long pepper (pippali)"],
      instructions: "Mix equal parts of the three spices. Take 1/4 tsp with warm water or honey before meals.",
      doshaBalance: { vata: 1, pitta: 2, kapha: -4 },
      benefits: ["Stimulates digestion", "Reduces lethargy", "Burns excess fat"],
    },
    {
      id: 9,
      name: "Dry Garshana (Brush Massage)",
      description: "Stimulating dry brush massage to improve circulation and reduce water retention.",
      ingredients: ["Raw silk gloves or natural bristle brush"],
      instructions: "Before shower, use brisk strokes toward the heart. Focus on areas of swelling or heaviness. Follow with warm shower.",
      doshaBalance: { vata: 1, pitta: 0, kapha: -3 },
      benefits: ["Stimulates circulation", "Reduces water retention", "Invigorates the body"],
    },
  ],
};

// Dietary advice per dosha
const dietaryAdvice: Record<DoshaType, string[]> = {
  vata: [
    "Favor warm, cooked, moist foods over raw and cold",
    "Include healthy fats like ghee, olive oil, and sesame oil",
    "Eat regular meals at consistent times",
    "Emphasize sweet, sour, and salty tastes",
    "Avoid caffeine and stimulants that increase anxiety",
    "Include warming spices like ginger, cinnamon, and cumin",
  ],
  pitta: [
    "Favor cool or warm (not hot) foods",
    "Emphasize sweet, bitter, and astringent tastes",
    "Avoid spicy, sour, and fermented foods",
    "Eat plenty of fresh vegetables and sweet fruits",
    "Limit alcohol, coffee, and acidic foods",
    "Include cooling herbs like coriander, fennel, and mint",
  ],
  kapha: [
    "Favor light, warm, and dry foods",
    "Emphasize pungent, bitter, and astringent tastes",
    "Avoid heavy, oily, and sweet foods",
    "Eat plenty of vegetables and legumes",
    "Limit dairy products and heavy grains",
    "Include stimulating spices like ginger, black pepper, and turmeric",
  ],
};

// Lifestyle advice per dosha
const lifestyleAdvice: Record<DoshaType, string[]> = {
  vata: [
    "Maintain a regular daily routine for meals and sleep",
    "Practice gentle yoga and meditation",
    "Keep warm and avoid cold, windy environments",
    "Get adequate rest - aim for 8 hours of sleep",
    "Practice self-oil massage (abhyanga) daily",
    "Create a calm, peaceful living environment",
  ],
  pitta: [
    "Avoid excessive heat and direct sun exposure",
    "Take regular breaks during intense work",
    "Practice cooling activities like swimming",
    "Spend time in nature, especially near water",
    "Cultivate patience through meditation",
    "Avoid competitive situations when possible",
  ],
  kapha: [
    "Wake up early (before 6 AM) and stay active",
    "Engage in vigorous daily exercise",
    "Avoid daytime napping",
    "Embrace variety and new experiences",
    "Keep your living space bright and clutter-free",
    "Practice stimulating activities to maintain energy",
  ],
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Quiz submission endpoint
  app.post("/api/quiz/submit", (req, res) => {
    try {
      // Validate request body with Zod schema
      const validationResult = quizSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }

      const { answers } = validationResult.data;

      if (answers.length === 0) {
        return res.status(400).json({ error: "No answers provided" });
      }

      // Calculate dosha balance
      const balance = { vata: 0, pitta: 0, kapha: 0 };
      answers.forEach((answer) => {
        balance[answer.selectedDosha]++;
      });

      // Convert to percentages
      const total = answers.length;
      const percentageBalance = {
        vata: Math.round((balance.vata / total) * 100),
        pitta: Math.round((balance.pitta / total) * 100),
        kapha: Math.round((balance.kapha / total) * 100),
      };

      // Determine primary and secondary dosha
      const sorted = Object.entries(percentageBalance).sort(([, a], [, b]) => b - a);
      const primaryDosha = sorted[0][0] as DoshaType;
      const secondaryDosha = sorted[1][1] > 20 ? sorted[1][0] as DoshaType : undefined;

      const doshaInfo = doshaDescriptions[primaryDosha];

      const result: DoshaResult = {
        primaryDosha,
        secondaryDosha,
        balance: percentageBalance,
        description: doshaInfo.description,
        characteristics: doshaInfo.characteristics,
        recommendations: doshaInfo.recommendations,
      };

      return res.json(result);
    } catch (error) {
      console.error("Quiz submission error:", error);
      return res.status(500).json({ error: "Failed to process quiz results" });
    }
  });

  // Symptom analysis endpoint
  app.post("/api/symptoms/analyze", (req, res) => {
    try {
      // Validate request body with Zod schema
      const validationResult = symptomCheckSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }

      const { symptoms } = validationResult.data;

      if (symptoms.length === 0) {
        return res.status(400).json({ error: "No symptoms provided" });
      }

      // Calculate which dosha is most imbalanced based on symptoms
      const doshaCount = { vata: 0, pitta: 0, kapha: 0 };
      symptoms.forEach((symptomId) => {
        const dosha = symptomDoshaMapping[symptomId];
        if (dosha) {
          doshaCount[dosha]++;
        }
      });

      // Find the imbalanced dosha
      const sorted = Object.entries(doshaCount).sort(([, a], [, b]) => b - a);
      const imbalancedDosha = sorted[0][0] as DoshaType;
      const count = sorted[0][1];

      // Determine severity based on number of symptoms
      let severity: "mild" | "moderate" | "significant";
      if (count <= 2) {
        severity = "mild";
      } else if (count <= 4) {
        severity = "moderate";
      } else {
        severity = "significant";
      }

      const analysis: SymptomAnalysis = {
        imbalancedDosha,
        severity,
        remedies: remedies[imbalancedDosha],
        dietaryAdvice: dietaryAdvice[imbalancedDosha],
        lifestyleAdvice: lifestyleAdvice[imbalancedDosha],
      };

      return res.json(analysis);
    } catch (error) {
      console.error("Symptom analysis error:", error);
      return res.status(500).json({ error: "Failed to analyze symptoms" });
    }
  });

  return httpServer;
}
