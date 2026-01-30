import { z } from "zod";

// Dosha types
export type DoshaType = "vata" | "pitta" | "kapha";
export type DoshaBalance = {
  vata: number;
  pitta: number;
  kapha: number;
};

// Quiz question schema
export const quizQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  category: z.string(),
  options: z.array(z.object({
    text: z.string(),
    dosha: z.enum(["vata", "pitta", "kapha"]),
  })),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

// Quiz answer schema
export const quizAnswerSchema = z.object({
  questionId: z.number(),
  selectedDosha: z.enum(["vata", "pitta", "kapha"]),
});

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;

// Quiz submission schema
export const quizSubmissionSchema = z.object({
  answers: z.array(quizAnswerSchema),
});

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

// Dosha result schema
export const doshaResultSchema = z.object({
  primaryDosha: z.enum(["vata", "pitta", "kapha"]),
  secondaryDosha: z.enum(["vata", "pitta", "kapha"]).optional(),
  balance: z.object({
    vata: z.number(),
    pitta: z.number(),
    kapha: z.number(),
  }),
  description: z.string(),
  characteristics: z.array(z.string()),
  recommendations: z.object({
    diet: z.array(z.string()),
    lifestyle: z.array(z.string()),
    exercise: z.array(z.string()),
    herbs: z.array(z.string()),
  }),
});

export type DoshaResult = z.infer<typeof doshaResultSchema>;

// Symptom schema
export const symptomSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
});

export type Symptom = z.infer<typeof symptomSchema>;

// Symptom check submission
export const symptomCheckSchema = z.object({
  symptoms: z.array(z.number()),
});

export type SymptomCheck = z.infer<typeof symptomCheckSchema>;

// Remedy schema
export const remedySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
  doshaBalance: z.object({
    vata: z.number(),
    pitta: z.number(),
    kapha: z.number(),
  }),
  benefits: z.array(z.string()),
});

export type Remedy = z.infer<typeof remedySchema>;

// Symptom analysis result
export const symptomAnalysisSchema = z.object({
  imbalancedDosha: z.enum(["vata", "pitta", "kapha"]),
  severity: z.enum(["mild", "moderate", "significant"]),
  remedies: z.array(remedySchema),
  dietaryAdvice: z.array(z.string()),
  lifestyleAdvice: z.array(z.string()),
});

export type SymptomAnalysis = z.infer<typeof symptomAnalysisSchema>;

// Preventive tip categories
export type PreventiveTipCategory = 
  | "lifestyle" 
  | "food" 
  | "hydration" 
  | "sleep" 
  | "activity" 
  | "mental_wellness";

// Wellness score ranges
export type WellnessScoreRange = "low" | "medium" | "high";

// Preventive tip schema
export const preventiveTipSchema = z.object({
  id: z.string(),
  category: z.enum(["lifestyle", "food", "hydration", "sleep", "activity", "mental_wellness"]),
  dosha: z.enum(["vata", "pitta", "kapha"]),
  scoreRange: z.enum(["low", "medium", "high"]),
  title: z.string(),
  description: z.string(),
  benefit: z.string(),
  riskPrevention: z.string(),
  icon: z.string(),
});

export type PreventiveTip = z.infer<typeof preventiveTipSchema>;

// Daily preventive care response
export const dailyPreventiveCareSchema = z.object({
  date: z.string(),
  wellnessScore: z.number(),
  primaryDosha: z.enum(["vata", "pitta", "kapha"]),
  tips: z.array(preventiveTipSchema),
  greeting: z.string(),
  focusArea: z.string(),
  streakDays: z.number(),
});

export type DailyPreventiveCare = z.infer<typeof dailyPreventiveCareSchema>;

// User wellness profile (for future database storage)
export const userWellnessProfileSchema = z.object({
  id: z.string(),
  primaryDosha: z.enum(["vata", "pitta", "kapha"]),
  secondaryDosha: z.enum(["vata", "pitta", "kapha"]).optional(),
  wellnessScore: z.number(),
  balance: z.object({
    vata: z.number(),
    pitta: z.number(),
    kapha: z.number(),
  }),
  lastAssessmentDate: z.string(),
  streakDays: z.number(),
  tipsViewed: z.array(z.string()),
});

export type UserWellnessProfile = z.infer<typeof userWellnessProfileSchema>;
