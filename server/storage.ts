import { randomUUID } from "crypto";
import type {
  HealthCheckCase,
  UserContext,
  SymptomInput,
  AdvancedInputs,
  UserFeedback,
  AdminStats,
} from "@shared/schema";

// ========================
// STORAGE INTERFACE
// Reference: Spec - Modular architecture requirement
// ========================

export interface IStorage {
  // Health Check Cases
  createCase(userContext: UserContext): Promise<HealthCheckCase>;
  getCase(id: string): Promise<HealthCheckCase | undefined>;
  updateCase(id: string, updates: Partial<HealthCheckCase>): Promise<HealthCheckCase | undefined>;
  getAllCases(): Promise<HealthCheckCase[]>;
  
  // Feedback
  submitFeedback(feedback: Omit<UserFeedback, "id" | "createdAt">): Promise<UserFeedback>;
  getFeedbackByCase(caseId: string): Promise<UserFeedback | undefined>;
  
  // Admin Stats
  getAdminStats(): Promise<AdminStats>;
  
  // Analytics tracking
  trackDropOff(stage: string): void;
  trackSafetyFlag(): void;
  trackAdvancedInputTrigger(): void;
}

// ========================
// IN-MEMORY STORAGE IMPLEMENTATION
// ========================

export class MemStorage implements IStorage {
  private cases: Map<string, HealthCheckCase>;
  private feedback: Map<string, UserFeedback>;
  private dropOffCounts: Map<string, number>;
  private safetyFlagCount: number;
  private advancedInputTriggerCount: number;

  constructor() {
    this.cases = new Map();
    this.feedback = new Map();
    this.dropOffCounts = new Map();
    this.safetyFlagCount = 0;
    this.advancedInputTriggerCount = 0;
  }

  // Create new health check case
  async createCase(userContext: UserContext): Promise<HealthCheckCase> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const newCase: HealthCheckCase = {
      id,
      status: "context_collected",
      userContext,
      createdAt: now,
      updatedAt: now,
    };
    
    this.cases.set(id, newCase);
    return newCase;
  }

  // Get case by ID
  async getCase(id: string): Promise<HealthCheckCase | undefined> {
    return this.cases.get(id);
  }

  // Update case
  async updateCase(id: string, updates: Partial<HealthCheckCase>): Promise<HealthCheckCase | undefined> {
    const existing = this.cases.get(id);
    if (!existing) return undefined;
    
    const updated: HealthCheckCase = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.cases.set(id, updated);
    return updated;
  }

  // Get all cases
  async getAllCases(): Promise<HealthCheckCase[]> {
    return Array.from(this.cases.values());
  }

  // Submit feedback
  async submitFeedback(feedbackData: Omit<UserFeedback, "id" | "createdAt">): Promise<UserFeedback> {
    const id = randomUUID();
    const feedback: UserFeedback = {
      ...feedbackData,
      id,
      createdAt: new Date().toISOString(),
    };
    
    this.feedback.set(id, feedback);
    return feedback;
  }

  // Get feedback by case ID
  async getFeedbackByCase(caseId: string): Promise<UserFeedback | undefined> {
    return Array.from(this.feedback.values()).find(f => f.caseId === caseId);
  }

  // Analytics tracking
  trackDropOff(stage: string): void {
    const current = this.dropOffCounts.get(stage) || 0;
    this.dropOffCounts.set(stage, current + 1);
  }

  trackSafetyFlag(): void {
    this.safetyFlagCount++;
  }

  trackAdvancedInputTrigger(): void {
    this.advancedInputTriggerCount++;
  }

  // Get admin stats (Section 12)
  async getAdminStats(): Promise<AdminStats> {
    const cases = Array.from(this.cases.values());
    
    // Count symptoms
    const symptomCounts = new Map<string, number>();
    cases.forEach(c => {
      c.symptomInput?.selectedSymptomIds.forEach(id => {
        const key = `symptom_${id}`;
        symptomCounts.set(key, (symptomCounts.get(key) || 0) + 1);
      });
    });
    
    // Count dosha patterns
    const doshaPatterns = { vata: 0, pitta: 0, kapha: 0 };
    cases.forEach(c => {
      const dosha = c.diagnosisResult?.ayurvedicAssessment?.prakriti;
      if (dosha) doshaPatterns[dosha]++;
    });
    
    // Calculate drop-off percentages
    const totalCases = cases.length || 1;
    const dropOffPoints = Array.from(this.dropOffCounts.entries()).map(([stage, count]) => ({
      stage,
      count,
      percentage: Math.round((count / totalCases) * 100),
    }));
    
    return {
      userCount: cases.length,
      commonSymptoms: Array.from(symptomCounts.entries())
        .map(([symptom, count]) => ({ symptom, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      doshaPatterns,
      dropOffPoints,
      advancedInputTriggers: this.advancedInputTriggerCount,
      safetyFlags: this.safetyFlagCount,
    };
  }
}

export const storage = new MemStorage();
