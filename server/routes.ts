import type { Express } from "express";
import { createServer, type Server } from "http";
import { doshaDescriptions } from "@shared/quiz-data";
import { getTipsForProfile, getGreeting, getFocusArea } from "@shared/preventive-tips";
import { 
  quizSubmissionSchema, 
  symptomCheckSchema, 
  createCaseRequestSchema,
  type DoshaResult, 
  type DoshaType, 
  type SymptomAnalysis, 
  type Remedy, 
  type DailyPreventiveCare,
  type HealthCheckCase,
  type DiagnosisResult,
  type PreventiveGuidance,
  type UserContext,
  type SymptomInput
} from "@shared/schema";
import { randomUUID } from "crypto";

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

  // Daily preventive care endpoint
  app.post("/api/preventive-care/daily", (req, res) => {
    try {
      const { primaryDosha, wellnessScore, streakDays = 0 } = req.body;

      if (!primaryDosha || typeof wellnessScore !== "number") {
        return res.status(400).json({ 
          error: "Missing required fields: primaryDosha and wellnessScore" 
        });
      }

      if (!["vata", "pitta", "kapha"].includes(primaryDosha)) {
        return res.status(400).json({ error: "Invalid dosha type" });
      }

      // Get personalized tips based on dosha and wellness score
      const tips = getTipsForProfile(primaryDosha as DoshaType, wellnessScore, 3);
      const greeting = getGreeting(primaryDosha as DoshaType);
      const focusArea = getFocusArea(primaryDosha as DoshaType, wellnessScore);

      const response: DailyPreventiveCare = {
        date: new Date().toISOString().split("T")[0],
        wellnessScore,
        primaryDosha: primaryDosha as DoshaType,
        tips,
        greeting,
        focusArea,
        streakDays: streakDays + 1,
      };

      return res.json(response);
    } catch (error) {
      console.error("Preventive care error:", error);
      return res.status(500).json({ error: "Failed to generate preventive care tips" });
    }
  });

  // ========================
  // HEALTH CHECK FLOW ENDPOINTS
  // ========================

  // Dual diagnosis engine (stub with Ayurvedic rules + AI placeholder)
  function runDiagnosisEngine(
    userContext: UserContext, 
    symptomInput: SymptomInput
  ): { diagnosisResult: DiagnosisResult; preventiveGuidance: PreventiveGuidance } {
    const { selectedSymptomIds, freeText } = symptomInput;
    const { lifestyle, primaryGoal } = userContext;

    // Calculate dosha imbalance from symptoms
    const doshaCount = { vata: 0, pitta: 0, kapha: 0 };
    selectedSymptomIds.forEach((symptomId) => {
      const dosha = symptomDoshaMapping[symptomId];
      if (dosha) {
        doshaCount[dosha]++;
      }
    });

    // Determine primary imbalanced dosha (vikriti)
    const sorted = Object.entries(doshaCount).sort(([, a], [, b]) => b - a);
    const vikriti = (sorted[0][1] > 0 ? sorted[0][0] : "vata") as DoshaType;
    
    // Prakriti is estimated from lifestyle (stub - would normally come from quiz)
    let prakriti: DoshaType = "vata";
    if (lifestyle.activityLevel === "active" && lifestyle.stressLevel !== "low") {
      prakriti = "pitta";
    } else if (lifestyle.activityLevel === "sedentary" && lifestyle.sleepQuality !== "poor") {
      prakriti = "kapha";
    }

    // Calculate dosha balance percentages
    const total = Math.max(selectedSymptomIds.length, 1);
    const doshaBalance = {
      vata: Math.round((doshaCount.vata / total) * 100) || 33,
      pitta: Math.round((doshaCount.pitta / total) * 100) || 33,
      kapha: Math.round((doshaCount.kapha / total) * 100) || 34,
    };

    // Normalize to 100%
    const balanceTotal = doshaBalance.vata + doshaBalance.pitta + doshaBalance.kapha;
    if (balanceTotal !== 100 && balanceTotal > 0) {
      const diff = 100 - balanceTotal;
      doshaBalance[vikriti] += diff;
    }

    // Determine imbalance level
    const maxImbalance = Math.max(doshaCount.vata, doshaCount.pitta, doshaCount.kapha);
    let imbalanceLevel: "mild" | "moderate" | "significant" = "mild";
    if (maxImbalance >= 4) imbalanceLevel = "significant";
    else if (maxImbalance >= 2) imbalanceLevel = "moderate";

    // AI confidence stub (would be ML model in production)
    let confidence = 75;
    if (selectedSymptomIds.length === 0) confidence = 40;
    else if (selectedSymptomIds.length >= 5) confidence = 85;
    else if (selectedSymptomIds.length >= 3) confidence = 78;

    // Detect if multiple conditions match (low confidence scenario)
    const hasMultipleMatches = sorted.filter(([, count]) => count >= 2).length >= 2;
    if (hasMultipleMatches) confidence -= 15;

    // Check for red flags based on symptoms
    const redFlags: string[] = [];
    const severeSymptomIds = [4, 9, 13, 14, 19, 22]; // Joint pain, heartburn, burning, diarrhea, swelling, depression
    const hasSevereSymptoms = selectedSymptomIds.some(id => severeSymptomIds.includes(id));
    
    if (hasSevereSymptoms && selectedSymptomIds.length >= 3) {
      redFlags.push("Consider consulting a healthcare provider if symptoms persist for more than 2 weeks.");
    }
    if (selectedSymptomIds.includes(22)) {
      redFlags.push("If you're experiencing persistent sadness or depression, please speak with a mental health professional.");
    }

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "low";
    if (selectedSymptomIds.length >= 5 || hasSevereSymptoms) riskLevel = "medium";
    if (redFlags.length >= 2 || imbalanceLevel === "significant") riskLevel = "high";

    // Determine if advanced inputs are needed
    const skinSymptomIds = [2, 10]; // Dry skin, skin rashes
    const digestiveSymptomIds = [3, 7, 9, 14, 21]; // Constipation, bloating, heartburn, diarrhea, loss of appetite
    
    const hasSkinIssues = selectedSymptomIds.some(id => skinSymptomIds.includes(id));
    const hasDigestiveIssues = selectedSymptomIds.some(id => digestiveSymptomIds.includes(id));
    
    const requiresAdvancedInputs = confidence < 60 || hasMultipleMatches || primaryGoal === "current_discomfort";
    const requiredInputTypes: Array<"skin" | "tongue" | "face" | "doctor_consultation"> = [];
    
    if (requiresAdvancedInputs) {
      if (hasSkinIssues) requiredInputTypes.push("skin");
      if (hasDigestiveIssues) requiredInputTypes.push("tongue");
      if (riskLevel === "high") requiredInputTypes.push("doctor_consultation");
      if (requiredInputTypes.length === 0) requiredInputTypes.push("face");
    }

    // Generate possible conditions based on symptoms (stub AI output)
    const possibleConditions: Array<{ name: string; confidence: number; category: string; relatedDosha?: DoshaType }> = [];
    
    if (doshaCount.vata >= 2) {
      possibleConditions.push({
        name: "Vata Imbalance Pattern",
        confidence: Math.min(90, 60 + doshaCount.vata * 10),
        category: "Dosha Imbalance",
        relatedDosha: "vata"
      });
    }
    if (doshaCount.pitta >= 2) {
      possibleConditions.push({
        name: "Pitta Aggravation Pattern",
        confidence: Math.min(90, 60 + doshaCount.pitta * 10),
        category: "Dosha Imbalance",
        relatedDosha: "pitta"
      });
    }
    if (doshaCount.kapha >= 2) {
      possibleConditions.push({
        name: "Kapha Accumulation Pattern",
        confidence: Math.min(90, 60 + doshaCount.kapha * 10),
        category: "Dosha Imbalance",
        relatedDosha: "kapha"
      });
    }

    const diagnosisResult: DiagnosisResult = {
      ayurvedicAssessment: {
        prakriti,
        vikriti,
        imbalanceLevel,
        doshaBalance,
      },
      possibleConditions,
      confidence,
      riskLevel,
      requiresAdvancedInputs,
      requiredInputTypes,
      requiresDoctorReview: riskLevel === "high",
      redFlags,
    };

    // Generate preventive guidance based on vikriti
    const preventiveGuidance: PreventiveGuidance = {
      habits: lifestyleAdvice[vikriti].slice(0, 3),
      foodPreferences: dietaryAdvice[vikriti].slice(0, 3),
      sleepTips: getSleepTips(vikriti, lifestyle.sleepQuality),
      stressTips: getStressTips(vikriti, lifestyle.stressLevel),
      warnings: getWarnings(vikriti),
    };

    return { diagnosisResult, preventiveGuidance };
  }

  // Helper functions for preventive guidance
  function getSleepTips(dosha: DoshaType, sleepQuality: string): string[] {
    const tips: Record<DoshaType, string[]> = {
      vata: [
        "Establish a consistent bedtime routine before 10pm",
        "Apply warm sesame oil to feet before sleep",
        "Avoid screens for 1 hour before bed"
      ],
      pitta: [
        "Keep bedroom cool and well-ventilated",
        "Practice calming breathing before sleep",
        "Avoid intense work or discussions in the evening"
      ],
      kapha: [
        "Wake up before 6am to avoid morning heaviness",
        "Keep bedroom free of clutter and well-lit during day",
        "Avoid sleeping during the day"
      ]
    };
    return sleepQuality === "poor" || sleepQuality === "fair" ? tips[dosha] : tips[dosha].slice(0, 1);
  }

  function getStressTips(dosha: DoshaType, stressLevel: string): string[] {
    const tips: Record<DoshaType, string[]> = {
      vata: [
        "Practice grounding meditation or yoga nidra",
        "Maintain a consistent daily routine",
        "Spend time in nature, especially near trees"
      ],
      pitta: [
        "Practice cooling pranayama (Shitali breath)",
        "Take regular breaks during intense work",
        "Engage in non-competitive physical activities"
      ],
      kapha: [
        "Try energizing activities like brisk walking",
        "Embrace new experiences and social activities",
        "Practice stimulating pranayama (Bhastrika)"
      ]
    };
    return stressLevel === "high" || stressLevel === "very_high" ? tips[dosha] : tips[dosha].slice(0, 1);
  }

  function getWarnings(dosha: DoshaType): string[] {
    const warnings: Record<DoshaType, string[]> = {
      vata: [
        "Avoid cold, dry foods and raw vegetables",
        "Minimize caffeine and stimulants",
        "Avoid irregular meal times"
      ],
      pitta: [
        "Avoid spicy, sour, and fermented foods",
        "Limit exposure to direct sunlight",
        "Avoid alcohol and excessive coffee"
      ],
      kapha: [
        "Avoid heavy, oily, and sweet foods",
        "Limit dairy products",
        "Avoid excessive rest and sedentary behavior"
      ]
    };
    return warnings[dosha].slice(0, 2);
  }

  // Create health check case endpoint
  app.post("/api/health-check/create", (req, res) => {
    try {
      // Validate request body with Zod schema
      const validationResult = createCaseRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }

      const { userContext } = validationResult.data;
      const symptomInput = req.body.symptomInput || { selectedSymptomIds: [], freeText: "" };

      if (!symptomInput.selectedSymptomIds || symptomInput.selectedSymptomIds.length === 0) {
        return res.status(400).json({ error: "At least one symptom must be selected" });
      }

      // Run the dual diagnosis engine
      const { diagnosisResult, preventiveGuidance } = runDiagnosisEngine(userContext, symptomInput);

      // Create the case
      const healthCase: HealthCheckCase = {
        id: randomUUID(),
        status: diagnosisResult.requiresAdvancedInputs ? "awaiting_advanced_inputs" : "diagnosis_complete",
        userContext,
        symptomInput,
        diagnosisResult,
        preventiveGuidance,
        createdAt: new Date().toISOString(),
      };

      return res.json(healthCase);
    } catch (error) {
      console.error("Health check create error:", error);
      return res.status(500).json({ error: "Failed to create health check case" });
    }
  });

  return httpServer;
}
