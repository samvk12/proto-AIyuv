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

// ========================
// HEALTH CHECK FLOW SCHEMAS
// ========================

// City tier for context
export type CityTier = "tier1" | "tier2" | "tier3" | "rural";

// Lifestyle factors
export const lifestyleSchema = z.object({
  sleepQuality: z.enum(["poor", "fair", "good", "excellent"]),
  stressLevel: z.enum(["low", "moderate", "high", "very_high"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active"]),
});

export type Lifestyle = z.infer<typeof lifestyleSchema>;

// User context collection
export const userContextSchema = z.object({
  ageRange: z.enum(["18-25", "26-35", "36-45", "46-55", "56-65", "65+"]),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  cityTier: z.enum(["tier1", "tier2", "tier3", "rural"]),
  lifestyle: lifestyleSchema,
  primaryGoal: z.enum(["prevention", "current_discomfort", "long_term_wellness"]),
});

export type UserContext = z.infer<typeof userContextSchema>;

// Symptom input for health check
export const symptomInputSchema = z.object({
  selectedSymptomIds: z.array(z.number()),
  freeText: z.string().optional(),
});

export type SymptomInput = z.infer<typeof symptomInputSchema>;

// Advanced input types (images, etc.)
export const advancedInputSchema = z.object({
  skinImageUrl: z.string().optional(),
  tongueImageUrl: z.string().optional(),
  faceImageUrl: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type AdvancedInput = z.infer<typeof advancedInputSchema>;

// Risk level for diagnosis
export type RiskLevel = "low" | "medium" | "high";

// Possible condition detected
export const possibleConditionSchema = z.object({
  name: z.string(),
  confidence: z.number(),
  category: z.string(),
  relatedDosha: z.enum(["vata", "pitta", "kapha"]).optional(),
});

export type PossibleCondition = z.infer<typeof possibleConditionSchema>;

// Ayurvedic assessment
export const ayurvedicAssessmentSchema = z.object({
  prakriti: z.enum(["vata", "pitta", "kapha"]),
  vikriti: z.enum(["vata", "pitta", "kapha"]),
  imbalanceLevel: z.enum(["mild", "moderate", "significant"]),
  doshaBalance: z.object({
    vata: z.number(),
    pitta: z.number(),
    kapha: z.number(),
  }),
});

export type AyurvedicAssessment = z.infer<typeof ayurvedicAssessmentSchema>;

// Diagnosis result from the engine
export const diagnosisResultSchema = z.object({
  ayurvedicAssessment: ayurvedicAssessmentSchema,
  possibleConditions: z.array(possibleConditionSchema),
  confidence: z.number(),
  riskLevel: z.enum(["low", "medium", "high"]),
  requiresAdvancedInputs: z.boolean(),
  requiredInputTypes: z.array(z.enum(["skin", "tongue", "face", "doctor_consultation"])),
  requiresDoctorReview: z.boolean(),
  redFlags: z.array(z.string()),
});

export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;

// Preventive guidance output
export const preventiveGuidanceSchema = z.object({
  habits: z.array(z.string()),
  foodPreferences: z.array(z.string()),
  sleepTips: z.array(z.string()),
  stressTips: z.array(z.string()),
  warnings: z.array(z.string()),
});

export type PreventiveGuidance = z.infer<typeof preventiveGuidanceSchema>;

// Case status for the health check flow
export type CaseStatus = 
  | "context_collected"
  | "symptoms_submitted"
  | "diagnosis_pending"
  | "awaiting_advanced_inputs"
  | "diagnosis_complete"
  | "awaiting_doctor_review"
  | "doctor_approved"
  | "doctor_rejected"
  | "completed";

// Health check case/encounter
export const healthCheckCaseSchema = z.object({
  id: z.string(),
  status: z.enum([
    "context_collected",
    "symptoms_submitted",
    "diagnosis_pending",
    "awaiting_advanced_inputs",
    "diagnosis_complete",
    "awaiting_doctor_review",
    "doctor_approved",
    "doctor_rejected",
    "completed"
  ]),
  userContext: userContextSchema,
  symptomInput: symptomInputSchema.optional(),
  advancedInputs: advancedInputSchema.optional(),
  diagnosisResult: diagnosisResultSchema.optional(),
  preventiveGuidance: preventiveGuidanceSchema.optional(),
  createdAt: z.string(),
});

export type HealthCheckCase = z.infer<typeof healthCheckCaseSchema>;

// API request schemas
export const createCaseRequestSchema = z.object({
  userContext: userContextSchema,
});

export const submitSymptomsRequestSchema = z.object({
  caseId: z.string(),
  symptomInput: symptomInputSchema,
});

export const submitAdvancedInputsRequestSchema = z.object({
  caseId: z.string(),
  advancedInputs: advancedInputSchema,
});
