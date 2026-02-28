import { createContext, useContext, useState, ReactNode } from "react";
import type { DoshaType, SeverityLevel } from "@/lib/symptom-flow";

export interface SymptomSelectionState {
  selectedSymptomIds: string[];
}

export interface AssessmentAnswerState {
  // symptomId -> questionId -> score
  [symptomId: string]: {
    [questionId: string]: number;
  };
}

export interface AnalysisResult {
  doshaBalance: { vata: number; pitta: number; kapha: number };
  overallSeverity: SeverityLevel;
}

export interface IntakeState {
  ageRange: string | null;
  region: string;
}

interface SymptomFlowContextValue {
  username: string;
  setUsername: (value: string) => void;
  intake: IntakeState;
  setIntake: (value: IntakeState) => void;
  selection: SymptomSelectionState;
  setSelection: (value: SymptomSelectionState) => void;
  answers: AssessmentAnswerState;
  setAnswers: (value: AssessmentAnswerState) => void;
  analysis: AnalysisResult | null;
  setAnalysis: (value: AnalysisResult | null) => void;
  isDoctorVerified: boolean;
  setDoctorVerified: (value: boolean) => void;
}

const SymptomFlowContext = createContext<SymptomFlowContextValue | undefined>(undefined);

export function SymptomFlowProvider({ children }: { children: ReactNode }) {
  const [usernameState, setUsernameState] = useState<string>(() => localStorage.getItem("username") || "");
  const setUsername = (value: string) => {
    const next = value.trim();
    setUsernameState(next);
    if (next) localStorage.setItem("username", next);
    else localStorage.removeItem("username");
  };

  const [intake, setIntake] = useState<IntakeState>({ ageRange: null, region: "" });
  const [selection, setSelection] = useState<SymptomSelectionState>({ selectedSymptomIds: [] });
  const [answers, setAnswers] = useState<AssessmentAnswerState>({});
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isDoctorVerified, setDoctorVerified] = useState(false);

  return (
    <SymptomFlowContext.Provider
      value={{
        username: usernameState,
        setUsername,
        intake,
        setIntake,
        selection,
        setSelection,
        answers,
        setAnswers,
        analysis,
        setAnalysis,
        isDoctorVerified,
        setDoctorVerified,
      }}
    >
      {children}
    </SymptomFlowContext.Provider>
  );
}

export function useSymptomFlow() {
  const ctx = useContext(SymptomFlowContext);
  if (!ctx) {
    throw new Error("useSymptomFlow must be used within a SymptomFlowProvider");
  }
  return ctx;
}

