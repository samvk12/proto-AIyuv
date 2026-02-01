import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { symptoms, isSkinSymptom, isDigestiveSymptom } from "@shared/symptoms-data";
import { doshaGuidance, medicalAwareness, DISCLAIMER } from "@shared/guidance-data";
import {
  createCaseRequestSchema,
  submitSymptomsRequestSchema,
  submitAdvancedInputsRequestSchema,
  submitFeedbackRequestSchema,
  type HealthCheckCase,
  type DiagnosisResult,
  type AyurvedicAssessment,
  type MedicalAssessment,
  type HealthSnapshot,
  type PreventiveGuidance,
  type NextStepsOptions,
  type ConfirmationGateResult,
  type DoshaType,
  type AdvancedInputType,
} from "@shared/schema";

// ========================
// SECTION 5: DUAL DIAGNOSIS ENGINE
// Reference: Spec - Ayurvedic Intelligence + Medical Intelligence (AI Stub)
// ========================

function runAyurvedicEngine(
  symptomIds: number[],
  sleepQuality: string,
  stressLevel: string,
  activityLevel: string
): AyurvedicAssessment {
  // Count symptoms by dosha
  const doshaCount = { vata: 0, pitta: 0, kapha: 0 };
  symptomIds.forEach(id => {
    const symptom = symptoms.find(s => s.id === id);
    if (symptom?.relatedDosha) {
      doshaCount[symptom.relatedDosha]++;
    }
  });

  // Determine vikriti (current imbalance)
  const sorted = Object.entries(doshaCount).sort(([, a], [, b]) => b - a);
  const vikriti = (sorted[0][1] > 0 ? sorted[0][0] : "vata") as DoshaType;

  // Estimate prakriti from lifestyle (stub - would come from quiz)
  let prakriti: DoshaType = "vata";
  if (activityLevel === "active" && stressLevel !== "low") {
    prakriti = "pitta";
  } else if (activityLevel === "sedentary" && sleepQuality !== "poor") {
    prakriti = "kapha";
  }

  // Calculate dosha balance
  const total = Math.max(symptomIds.length, 1);
  let doshaBalance = {
    vata: Math.round((doshaCount.vata / total) * 100) || 33,
    pitta: Math.round((doshaCount.pitta / total) * 100) || 33,
    kapha: Math.round((doshaCount.kapha / total) * 100) || 34,
  };

  // Normalize to 100%
  const balanceTotal = doshaBalance.vata + doshaBalance.pitta + doshaBalance.kapha;
  if (balanceTotal !== 100 && balanceTotal > 0) {
    doshaBalance[vikriti] += 100 - balanceTotal;
  }

  // Determine imbalance level
  const maxCount = Math.max(...Object.values(doshaCount));
  let imbalanceLevel: "mild" | "moderate" | "significant" = "mild";
  if (maxCount >= 4) imbalanceLevel = "significant";
  else if (maxCount >= 2) imbalanceLevel = "moderate";

  // Pattern consistency check
  const patternConsistent = vikriti === prakriti || maxCount >= 2;

  return {
    prakriti,
    vikriti,
    imbalanceLevel,
    doshaBalance,
    patternConsistent,
  };
}

function runMedicalEngine(
  symptomIds: number[],
  freeText: string | undefined,
  primaryGoal: string
): MedicalAssessment {
  // AI Stub - Section 6: AI Processing Rules
  // TODO: Replace with supervised ML models in production

  // Symptom clustering
  const clusters: string[] = [];
  const hasSkin = symptomIds.some(id => isSkinSymptom(id));
  const hasDigestive = symptomIds.some(id => isDigestiveSymptom(id));
  const hasMental = symptomIds.some(id => [2, 3, 8, 11, 19].includes(id));
  const hasPhysical = symptomIds.some(id => [6, 7, 12, 17, 20].includes(id));

  if (hasSkin) clusters.push("Dermatological");
  if (hasDigestive) clusters.push("Gastrointestinal");
  if (hasMental) clusters.push("Mental/Emotional");
  if (hasPhysical) clusters.push("Musculoskeletal/Systemic");

  // Confidence score calculation
  let confidenceScore = 75;
  if (symptomIds.length === 0) confidenceScore = 30;
  else if (symptomIds.length === 1) confidenceScore = 50;
  else if (symptomIds.length >= 5) confidenceScore = 85;
  else if (symptomIds.length >= 3) confidenceScore = 78;

  // Lower confidence if multiple clusters
  if (clusters.length >= 3) confidenceScore -= 15;

  // Red flag detection
  const redFlags: string[] = [];
  const severeSymptomIds = [6, 10, 13, 14, 20]; // Joint pain, heartburn, diarrhea, eye issues, swelling
  const hasSevere = symptomIds.some(id => severeSymptomIds.includes(id));

  if (hasSevere && symptomIds.length >= 3) {
    redFlags.push("Multiple symptoms with potential severity - monitoring recommended");
  }
  if (symptomIds.includes(19)) { // Lethargy
    redFlags.push("Persistent fatigue may warrant professional evaluation if ongoing");
  }

  // Risk stratification
  let riskLevel: "low" | "medium" | "high" = "low";
  if (symptomIds.length >= 5 || hasSevere) riskLevel = "medium";
  if (redFlags.length >= 2 || (primaryGoal === "current_discomfort" && symptomIds.length >= 4)) {
    riskLevel = "high";
  }

  // Possible conditions (not diagnoses - educational only)
  const possibleConditions: Array<{ name: string; confidence: number; category: string }> = [];
  
  if (hasSkin) {
    possibleConditions.push({
      name: "Skin sensitivity pattern",
      confidence: 60 + (symptomIds.filter(id => isSkinSymptom(id)).length * 10),
      category: "Dermatological",
    });
  }
  if (hasDigestive) {
    possibleConditions.push({
      name: "Digestive imbalance pattern",
      confidence: 60 + (symptomIds.filter(id => isDigestiveSymptom(id)).length * 10),
      category: "Gastrointestinal",
    });
  }

  return {
    symptomClusters: clusters,
    possibleConditions,
    confidenceScore: Math.min(100, Math.max(0, confidenceScore)),
    riskLevel,
    redFlags,
    referralRecommended: riskLevel === "high",
  };
}

// ========================
// SECTION 4: DIAGNOSTIC CONFIRMATION GATE
// Reference: Spec Section 4 - CRITICAL SAFETY FEATURE
// ========================

function evaluateConfirmationGate(
  symptomIds: number[],
  medicalAssessment: MedicalAssessment,
  primaryGoal: string
): ConfirmationGateResult {
  const triggerReasons: string[] = [];
  const requiredInputs: AdvancedInputType[] = [];

  // Check trigger conditions
  const multipleConditions = medicalAssessment.possibleConditions.length >= 2;
  const lowConfidence = medicalAssessment.confidenceScore < 60;
  const overlapping = medicalAssessment.symptomClusters.length >= 3;
  const isCurrentDiscomfort = primaryGoal === "current_discomfort";

  if (multipleConditions) triggerReasons.push("Symptoms match multiple conditions");
  if (lowConfidence) triggerReasons.push("AI confidence score is low");
  if (overlapping) triggerReasons.push("Overlapping symptom patterns detected");
  if (isCurrentDiscomfort) triggerReasons.push("Current discomfort requires additional verification");

  const triggered = triggerReasons.length > 0;

  // Determine required advanced inputs based on symptom categories
  if (triggered) {
    const hasSkin = symptomIds.some(id => isSkinSymptom(id));
    const hasDigestive = symptomIds.some(id => isDigestiveSymptom(id));
    
    if (hasSkin) requiredInputs.push("skin_image");
    if (hasDigestive) requiredInputs.push("tongue_image");
    if (medicalAssessment.riskLevel === "high") requiredInputs.push("doctor_consultation");
    if (requiredInputs.length === 0) requiredInputs.push("face_image");
  }

  return {
    triggered,
    triggerReasons,
    requiredInputs,
    inputsProvided: false, // Initially false, updated when inputs are submitted
    canProceed: !triggered, // Can proceed if gate not triggered
    canEnableMedicines: !triggered, // Medicines disabled if gate triggered
  };
}

// ========================
// API ROUTES
// ========================

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Get symptoms list
  app.get("/api/symptoms", (_req, res) => {
    res.json(symptoms);
  });

  // Create new health check case (Section 2: Context Collection)
  app.post("/api/case/create", async (req, res) => {
    try {
      const validation = createCaseRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid context data",
          details: validation.error.errors,
        });
      }

      const healthCase = await storage.createCase(validation.data.userContext);
      return res.json(healthCase);
    } catch (error) {
      console.error("Create case error:", error);
      return res.status(500).json({ error: "Failed to create case" });
    }
  });

  // Submit symptoms (Section 3: Symptom Input Layer)
  app.post("/api/case/:caseId/symptoms", async (req, res) => {
    try {
      const { caseId } = req.params;
      const healthCase = await storage.getCase(caseId);

      if (!healthCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      const validation = submitSymptomsRequestSchema.safeParse({
        caseId,
        symptomInput: req.body,
      });

      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid symptom data",
          details: validation.error.errors,
        });
      }

      const { symptomInput } = validation.data;

      if (symptomInput.selectedSymptomIds.length === 0) {
        return res.status(400).json({ error: "At least one symptom must be selected" });
      }

      // Run dual diagnosis engine
      const ayurvedicAssessment = runAyurvedicEngine(
        symptomInput.selectedSymptomIds,
        healthCase.userContext.sleepQuality,
        healthCase.userContext.stressLevel,
        healthCase.userContext.activityLevel
      );

      const medicalAssessment = runMedicalEngine(
        symptomInput.selectedSymptomIds,
        symptomInput.freeText,
        healthCase.userContext.primaryGoal
      );

      // Evaluate confirmation gate
      const confirmationGate = evaluateConfirmationGate(
        symptomInput.selectedSymptomIds,
        medicalAssessment,
        healthCase.userContext.primaryGoal
      );

      if (confirmationGate.triggered) {
        storage.trackAdvancedInputTrigger();
      }

      // Create diagnosis result
      const diagnosisResult: DiagnosisResult = {
        ayurvedicAssessment,
        medicalAssessment,
        overallConfidence: Math.round(
          (medicalAssessment.confidenceScore + (ayurvedicAssessment.patternConsistent ? 80 : 60)) / 2
        ),
        isFinalized: !confirmationGate.triggered,
      };

      // Generate health snapshot
      const healthSnapshot: HealthSnapshot = {
        summary: generateSummary(ayurvedicAssessment, medicalAssessment),
        doshaImbalance: {
          primary: ayurvedicAssessment.vikriti,
          level: ayurvedicAssessment.imbalanceLevel,
        },
        doshaVisualization: ayurvedicAssessment.doshaBalance,
      };

      // Generate preventive guidance
      const guidance = doshaGuidance[ayurvedicAssessment.vikriti];
      const preventiveGuidance: PreventiveGuidance = {
        habits: guidance.habits.slice(0, 3),
        foodPreferences: guidance.foodPreferences.slice(0, 3),
        sleepTips: guidance.sleepTips.slice(0, 2),
        stressTips: guidance.stressTips.slice(0, 2),
        activityTips: guidance.activityTips.slice(0, 2),
      };

      // Generate next steps options (Section 8)
      const nextStepsOptions: NextStepsOptions = {
        lifestyleOnlyEnabled: true, // Always enabled
        medicinesEnabled: confirmationGate.canEnableMedicines,
        medicinesDisabledReason: confirmationGate.triggered
          ? "Additional verification required before medicine recommendations"
          : undefined,
        consultDoctorEnabled: true,
      };

      // Track safety flags if needed
      if (medicalAssessment.redFlags.length > 0) {
        storage.trackSafetyFlag();
      }

      // Update case
      const updatedCase = await storage.updateCase(caseId, {
        status: confirmationGate.triggered ? "confirmation_gate" : "diagnosis_complete",
        symptomInput,
        confirmationGate,
        diagnosisResult,
        healthSnapshot,
        preventiveGuidance,
        medicalAwareness,
        nextStepsOptions,
      });

      return res.json({
        ...updatedCase,
        disclaimer: DISCLAIMER,
      });
    } catch (error) {
      console.error("Submit symptoms error:", error);
      return res.status(500).json({ error: "Failed to process symptoms" });
    }
  });

  // Submit advanced inputs (Section 4: When gate is triggered)
  app.post("/api/case/:caseId/advanced-inputs", async (req, res) => {
    try {
      const { caseId } = req.params;
      const healthCase = await storage.getCase(caseId);

      if (!healthCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      const validation = submitAdvancedInputsRequestSchema.safeParse({
        caseId,
        advancedInputs: req.body,
      });

      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid advanced input data",
          details: validation.error.errors,
        });
      }

      const { advancedInputs } = validation.data;

      // Check if required inputs are provided
      const gate = healthCase.confirmationGate;
      let inputsProvided = true;

      if (gate) {
        if (gate.requiredInputs.includes("skin_image") && !advancedInputs.skinImageUrl) {
          inputsProvided = false;
        }
        if (gate.requiredInputs.includes("tongue_image") && !advancedInputs.tongueImageUrl) {
          inputsProvided = false;
        }
        if (gate.requiredInputs.includes("doctor_consultation") && !advancedInputs.doctorConsultationCompleted) {
          inputsProvided = false;
        }
      }

      // Update confirmation gate
      const updatedGate: ConfirmationGateResult = {
        ...(gate || {
          triggered: true,
          triggerReasons: [],
          requiredInputs: [],
          inputsProvided: false,
          canProceed: false,
          canEnableMedicines: false,
        }),
        inputsProvided,
        canProceed: inputsProvided,
        canEnableMedicines: inputsProvided,
      };

      // Update next steps
      const nextStepsOptions: NextStepsOptions = {
        lifestyleOnlyEnabled: true,
        medicinesEnabled: inputsProvided,
        medicinesDisabledReason: inputsProvided ? undefined : "Required verification inputs not provided",
        consultDoctorEnabled: true,
      };

      const updatedCase = await storage.updateCase(caseId, {
        status: inputsProvided ? "diagnosis_complete" : "awaiting_advanced_inputs",
        advancedInputs,
        confirmationGate: updatedGate,
        nextStepsOptions,
        diagnosisResult: healthCase.diagnosisResult
          ? { ...healthCase.diagnosisResult, isFinalized: inputsProvided }
          : undefined,
      });

      return res.json({
        ...updatedCase,
        disclaimer: DISCLAIMER,
      });
    } catch (error) {
      console.error("Submit advanced inputs error:", error);
      return res.status(500).json({ error: "Failed to process advanced inputs" });
    }
  });

  // Get case by ID
  app.get("/api/case/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      const healthCase = await storage.getCase(caseId);

      if (!healthCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      return res.json({
        ...healthCase,
        disclaimer: DISCLAIMER,
      });
    } catch (error) {
      console.error("Get case error:", error);
      return res.status(500).json({ error: "Failed to retrieve case" });
    }
  });

  // Submit feedback (Section 11: Feedback Loop)
  app.post("/api/case/:caseId/feedback", async (req, res) => {
    try {
      const { caseId } = req.params;
      const healthCase = await storage.getCase(caseId);

      if (!healthCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      const validation = submitFeedbackRequestSchema.safeParse({
        caseId,
        ...req.body,
      });

      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid feedback data",
          details: validation.error.errors,
        });
      }

      const feedback = await storage.submitFeedback({
        caseId,
        wasHelpful: validation.data.wasHelpful,
        symptomsImproved: validation.data.symptomsImproved,
        sideEffects: validation.data.sideEffects,
        additionalComments: validation.data.additionalComments,
      });

      await storage.updateCase(caseId, {
        status: "completed",
        feedback,
      });

      return res.json({ success: true, feedback });
    } catch (error) {
      console.error("Submit feedback error:", error);
      return res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Admin stats (Section 12: Admin Dashboard)
  app.get("/api/admin/stats", async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      return res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      return res.status(500).json({ error: "Failed to retrieve stats" });
    }
  });

  return httpServer;
}

// Helper function to generate summary
function generateSummary(
  ayurvedic: AyurvedicAssessment,
  medical: MedicalAssessment
): string {
  const doshaNames: Record<DoshaType, string> = {
    vata: "Vata",
    pitta: "Pitta",
    kapha: "Kapha",
  };

  const imbalanceName = doshaNames[ayurvedic.vikriti];
  const level = ayurvedic.imbalanceLevel;

  let summary = `Based on your symptoms, you appear to have a ${level} ${imbalanceName} imbalance. `;

  if (ayurvedic.prakriti !== ayurvedic.vikriti) {
    summary += `Your natural constitution (Prakriti) appears to be ${doshaNames[ayurvedic.prakriti]}, but current factors have shifted your balance. `;
  }

  if (medical.riskLevel === "low") {
    summary += "This is generally manageable with lifestyle and dietary adjustments.";
  } else if (medical.riskLevel === "medium") {
    summary += "Consider monitoring your symptoms and making gradual lifestyle changes.";
  } else {
    summary += "We recommend consulting with a healthcare practitioner for personalized guidance.";
  }

  return summary;
}
