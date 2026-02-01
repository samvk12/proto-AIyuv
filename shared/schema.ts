import { z } from "zod";

// ========================
// SECTION 1: CORE TYPES
// ========================

// Dosha types - fundamental Ayurvedic constitution
export type DoshaType = "vata" | "pitta" | "kapha";

export const doshaTypeSchema = z.enum(["vata", "pitta", "kapha"]);

// Dosha balance percentages
export const doshaBalanceSchema = z.object({
  vata: z.number().min(0).max(100),
  pitta: z.number().min(0).max(100),
  kapha: z.number().min(0).max(100),
});

export type DoshaBalance = z.infer<typeof doshaBalanceSchema>;

// ========================
// SECTION 2: USER CONTEXT COLLECTION
// Reference: Spec Section 2
// ========================

export const userContextSchema = z.object({
  // Age range for health context
  ageRange: z.enum(["18-25", "26-35", "36-45", "46-55", "56-65", "65+"]),
  // Gender is optional
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  // City tier affects lifestyle recommendations
  cityTier: z.enum(["tier1", "tier2", "tier3", "rural"]),
  // Lifestyle factors
  sleepQuality: z.enum(["poor", "fair", "good", "excellent"]),
  stressLevel: z.enum(["low", "moderate", "high", "very_high"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active"]),
  // Primary health goal
  primaryGoal: z.enum(["prevention", "current_discomfort", "long_term_wellness"]),
});

export type UserContext = z.infer<typeof userContextSchema>;

// ========================
// SECTION 3: SYMPTOM INPUT LAYER
// Reference: Spec Section 3
// ========================

export const symptomSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  relatedDosha: doshaTypeSchema.optional(),
});

export type Symptom = z.infer<typeof symptomSchema>;

export const symptomInputSchema = z.object({
  // Selected symptom IDs from checklist
  selectedSymptomIds: z.array(z.number()),
  // Free-text additional input
  freeText: z.string().optional(),
});

export type SymptomInput = z.infer<typeof symptomInputSchema>;

// ========================
// SECTION 4: DIAGNOSTIC CONFIRMATION GATE
// Reference: Spec Section 4 - CRITICAL SAFETY FEATURE
// ========================

// Types of advanced inputs that may be required
export const advancedInputTypeSchema = z.enum([
  "skin_image",      // For skin issues
  "tongue_image",    // For digestive/metabolic
  "face_image",      // For facial indicators
  "doctor_consultation", // For systemic/unclear
  "pulse_reading",   // Future: practitioner-assisted
]);

export type AdvancedInputType = z.infer<typeof advancedInputTypeSchema>;

// Advanced inputs collected from user
export const advancedInputsSchema = z.object({
  skinImageUrl: z.string().optional(),
  tongueImageUrl: z.string().optional(),
  faceImageUrl: z.string().optional(),
  additionalNotes: z.string().optional(),
  doctorConsultationCompleted: z.boolean().optional(),
});

export type AdvancedInputs = z.infer<typeof advancedInputsSchema>;

// Confirmation gate result
export const confirmationGateResultSchema = z.object({
  // Whether the gate was triggered
  triggered: z.boolean(),
  // Reasons for triggering
  triggerReasons: z.array(z.string()),
  // Required advanced inputs
  requiredInputs: z.array(advancedInputTypeSchema),
  // Whether all required inputs are provided
  inputsProvided: z.boolean(),
  // Can proceed to final diagnosis
  canProceed: z.boolean(),
  // Can enable medicine option
  canEnableMedicines: z.boolean(),
});

export type ConfirmationGateResult = z.infer<typeof confirmationGateResultSchema>;

// ========================
// SECTION 5: DUAL DIAGNOSIS ENGINE
// Reference: Spec Section 5
// ========================

// A. Ayurvedic Intelligence (Rule-Based)
export const ayurvedicAssessmentSchema = z.object({
  // Constitutional type (birth constitution)
  prakriti: doshaTypeSchema,
  // Current imbalance state
  vikriti: doshaTypeSchema,
  // Imbalance severity
  imbalanceLevel: z.enum(["mild", "moderate", "significant"]),
  // Current dosha balance
  doshaBalance: doshaBalanceSchema,
  // Pattern consistency check passed
  patternConsistent: z.boolean(),
});

export type AyurvedicAssessment = z.infer<typeof ayurvedicAssessmentSchema>;

// B. Medical Intelligence (AI-Assisted)
export const medicalAssessmentSchema = z.object({
  // Symptom clusters identified
  symptomClusters: z.array(z.string()),
  // Possible conditions (not diagnoses)
  possibleConditions: z.array(z.object({
    name: z.string(),
    confidence: z.number().min(0).max(100),
    category: z.string(),
  })),
  // Confidence score (0-100)
  confidenceScore: z.number().min(0).max(100),
  // Risk stratification
  riskLevel: z.enum(["low", "medium", "high"]),
  // Red flags detected
  redFlags: z.array(z.string()),
  // Whether referral is recommended
  referralRecommended: z.boolean(),
});

export type MedicalAssessment = z.infer<typeof medicalAssessmentSchema>;

// Combined diagnosis result
export const diagnosisResultSchema = z.object({
  ayurvedicAssessment: ayurvedicAssessmentSchema,
  medicalAssessment: medicalAssessmentSchema,
  // Overall confidence after combining both
  overallConfidence: z.number().min(0).max(100),
  // Whether diagnosis is finalized
  isFinalized: z.boolean(),
});

export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;

// ========================
// SECTION 7: OUTPUT TO USER
// Reference: Spec Section 7
// ========================

// Health Snapshot - plain language summary
export const healthSnapshotSchema = z.object({
  summary: z.string(),
  doshaImbalance: z.object({
    primary: doshaTypeSchema,
    level: z.enum(["mild", "moderate", "significant"]),
  }),
  doshaVisualization: doshaBalanceSchema,
});

export type HealthSnapshot = z.infer<typeof healthSnapshotSchema>;

// Preventive Guidance - NO prescriptions
export const preventiveGuidanceSchema = z.object({
  habits: z.array(z.string()),
  foodPreferences: z.array(z.string()), // NOT prescriptions
  sleepTips: z.array(z.string()),
  stressTips: z.array(z.string()),
  activityTips: z.array(z.string()),
});

export type PreventiveGuidance = z.infer<typeof preventiveGuidanceSchema>;

// Medical Awareness section
export const medicalAwarenessSchema = z.object({
  escalationAdvice: z.array(z.string()),
  warningSignsToWatch: z.array(z.string()),
  whenToSeekHelp: z.array(z.string()),
});

export type MedicalAwareness = z.infer<typeof medicalAwarenessSchema>;

// ========================
// SECTION 8: NEXT STEPS OPTIONS
// Reference: Spec Section 8
// ========================

export const nextStepsOptionsSchema = z.object({
  // A. Lifestyle & Prevention Only (always enabled)
  lifestyleOnlyEnabled: z.literal(true),
  // B. Get Medicines - DISABLED if required inputs not provided
  medicinesEnabled: z.boolean(),
  medicinesDisabledReason: z.string().optional(),
  // C. Consult Doctor First
  consultDoctorEnabled: z.boolean(),
});

export type NextStepsOptions = z.infer<typeof nextStepsOptionsSchema>;

// ========================
// SECTION 9: DOCTOR CONFIRMATION FLOW
// Reference: Spec Section 9
// ========================

export const doctorCaseFileSchema = z.object({
  symptoms: symptomInputSchema,
  lifestyle: z.object({
    sleepQuality: z.string(),
    stressLevel: z.string(),
    activityLevel: z.string(),
  }),
  advancedInputs: advancedInputsSchema.optional(),
  aiConfidenceBefore: z.number(),
  aiConfidenceAfter: z.number().optional(),
  doshaAnalysis: ayurvedicAssessmentSchema,
});

export type DoctorCaseFile = z.infer<typeof doctorCaseFileSchema>;

export const doctorDecisionSchema = z.object({
  decision: z.enum(["approved", "modified", "rejected"]),
  approvedMedicines: z.array(z.string()).optional(),
  modifiedMedicines: z.array(z.string()).optional(),
  rejectionReason: z.string().optional(),
  consultationRequired: z.boolean(),
  doctorNotes: z.string().optional(),
  timestamp: z.string(),
});

export type DoctorDecision = z.infer<typeof doctorDecisionSchema>;

// ========================
// SECTION 10: MEDICINE FULFILLMENT
// Reference: Spec Section 10
// ========================

export const prescriptionSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  medicines: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
  })),
  doctorApprovalId: z.string(),
  pdfUrl: z.string().optional(),
  createdAt: z.string(),
});

export type Prescription = z.infer<typeof prescriptionSchema>;

// ========================
// SECTION 11: FEEDBACK LOOP
// Reference: Spec Section 11
// ========================

export const userFeedbackSchema = z.object({
  id: z.string(),
  caseId: z.string(),
  wasHelpful: z.boolean(),
  symptomsImproved: z.boolean().optional(),
  sideEffects: z.string().optional(),
  additionalComments: z.string().optional(),
  createdAt: z.string(),
});

export type UserFeedback = z.infer<typeof userFeedbackSchema>;

// ========================
// SECTION 12: ADMIN DASHBOARD
// Reference: Spec Section 12
// ========================

export const adminStatsSchema = z.object({
  userCount: z.number(),
  commonSymptoms: z.array(z.object({
    symptom: z.string(),
    count: z.number(),
  })),
  doshaPatterns: z.object({
    vata: z.number(),
    pitta: z.number(),
    kapha: z.number(),
  }),
  dropOffPoints: z.array(z.object({
    stage: z.string(),
    count: z.number(),
    percentage: z.number(),
  })),
  advancedInputTriggers: z.number(),
  safetyFlags: z.number(),
});

export type AdminStats = z.infer<typeof adminStatsSchema>;

// ========================
// HEALTH CHECK CASE (MAIN ENTITY)
// ========================

export const caseStatusSchema = z.enum([
  "context_collected",
  "symptoms_submitted",
  "confirmation_gate",
  "awaiting_advanced_inputs",
  "diagnosis_pending",
  "diagnosis_complete",
  "awaiting_doctor_review",
  "doctor_approved",
  "doctor_rejected",
  "completed",
]);

export type CaseStatus = z.infer<typeof caseStatusSchema>;

export const healthCheckCaseSchema = z.object({
  id: z.string(),
  status: caseStatusSchema,
  // Section 2: User Context
  userContext: userContextSchema,
  // Section 3: Symptom Input
  symptomInput: symptomInputSchema.optional(),
  // Section 4: Confirmation Gate
  confirmationGate: confirmationGateResultSchema.optional(),
  advancedInputs: advancedInputsSchema.optional(),
  // Section 5: Diagnosis
  diagnosisResult: diagnosisResultSchema.optional(),
  // Section 7: Output
  healthSnapshot: healthSnapshotSchema.optional(),
  preventiveGuidance: preventiveGuidanceSchema.optional(),
  medicalAwareness: medicalAwarenessSchema.optional(),
  // Section 8: Next Steps
  nextStepsOptions: nextStepsOptionsSchema.optional(),
  // Section 9: Doctor Flow
  doctorCaseFile: doctorCaseFileSchema.optional(),
  doctorDecision: doctorDecisionSchema.optional(),
  // Section 10: Prescription
  prescription: prescriptionSchema.optional(),
  // Section 11: Feedback
  feedback: userFeedbackSchema.optional(),
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type HealthCheckCase = z.infer<typeof healthCheckCaseSchema>;

// ========================
// API REQUEST SCHEMAS
// ========================

// Create new case with context
export const createCaseRequestSchema = z.object({
  userContext: userContextSchema,
});

export type CreateCaseRequest = z.infer<typeof createCaseRequestSchema>;

// Submit symptoms
export const submitSymptomsRequestSchema = z.object({
  caseId: z.string(),
  symptomInput: symptomInputSchema,
});

export type SubmitSymptomsRequest = z.infer<typeof submitSymptomsRequestSchema>;

// Submit advanced inputs
export const submitAdvancedInputsRequestSchema = z.object({
  caseId: z.string(),
  advancedInputs: advancedInputsSchema,
});

export type SubmitAdvancedInputsRequest = z.infer<typeof submitAdvancedInputsRequestSchema>;

// Request diagnosis
export const requestDiagnosisRequestSchema = z.object({
  caseId: z.string(),
});

export type RequestDiagnosisRequest = z.infer<typeof requestDiagnosisRequestSchema>;

// Submit feedback
export const submitFeedbackRequestSchema = z.object({
  caseId: z.string(),
  wasHelpful: z.boolean(),
  symptomsImproved: z.boolean().optional(),
  sideEffects: z.string().optional(),
  additionalComments: z.string().optional(),
});

export type SubmitFeedbackRequest = z.infer<typeof submitFeedbackRequestSchema>;

// User consent for doctor sharing
export const doctorConsentRequestSchema = z.object({
  caseId: z.string(),
  consentGiven: z.boolean(),
});

export type DoctorConsentRequest = z.infer<typeof doctorConsentRequestSchema>;
