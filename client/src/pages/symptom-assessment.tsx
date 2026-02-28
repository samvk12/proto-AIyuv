import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { symptomDefinitions, calculateDoshaBalance, calculateOverallSeverity } from "@/lib/symptom-flow";
import { useSymptomFlow } from "@/context/SymptomFlowContext";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import FlowStepper from "@/components/flow-stepper";

export default function SymptomAssessment() {
  const [, navigate] = useLocation();
  const { selection, answers, setAnswers, setAnalysis, username } = useSymptomFlow();
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  if (!username) {
    navigate("/patient");
    return null;
  }

  const selectedSymptoms = useMemo(
    () => symptomDefinitions.filter((s) => selection.selectedSymptomIds.includes(s.id)),
    [selection.selectedSymptomIds],
  );

  if (selectedSymptoms.length === 0) {
    navigate("/symptoms");
    return null;
  }

  useEffect(() => {
    setIsAnalyzing(true);
    const timer = window.setTimeout(() => setIsAnalyzing(false), 1400);
    return () => window.clearTimeout(timer);
  }, [selection.selectedSymptomIds.join(",")]);

  const totalQuestions = selectedSymptoms.reduce(
    (sum, s) => sum + s.questions.length,
    0,
  );

  const answeredCount = selectedSymptoms.reduce((sum, symptom) => {
    const symptomAnswers = answers[symptom.id] || {};
    return sum + Object.keys(symptomAnswers).length;
  }, 0);

  const progress = totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);
  const canContinue = answeredCount === totalQuestions;

  const handleAnswer = (symptomId: string, questionId: string, score: number) => {
    setAnswers({
      ...answers,
      [symptomId]: {
        ...(answers[symptomId] || {}),
        [questionId]: score,
      },
    });
  };

  const handleAnalyze = () => {
    const perSymptomScores: { symptomId: string; averageScore: number }[] = [];
    let allScores: number[] = [];

    selectedSymptoms.forEach((symptom) => {
      const qScores = symptom.questions.map((q) => answers[symptom.id]?.[q.id] ?? 0).filter(Boolean);
      if (qScores.length) {
        const avg =
          qScores.reduce((sum, val) => sum + val, 0) / qScores.length;
        perSymptomScores.push({ symptomId: symptom.id, averageScore: avg });
        allScores = allScores.concat(qScores);
      }
    });

    const globalAvg =
      allScores.reduce((sum, val) => sum + val, 0) / (allScores.length || 1);

    const doshaBalance = calculateDoshaBalance(perSymptomScores);
    const overallSeverity = calculateOverallSeverity(globalAvg);

    setAnalysis({
      doshaBalance,
      overallSeverity,
    });

    navigate("/results");
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/symptoms")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Symptoms
      </Button>

      <FlowStepper
        steps={["Intake", "Symptoms", "Assessment", "Results"]}
        currentStep={2}
        className="mb-6"
      />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <Badge variant="secondary" className="mb-2 text-[11px]">
              Step 3 of 4 • Assessment
            </Badge>
            <h1 className="text-xl md:text-2xl font-serif font-bold">
              Symptom Severity Assessment
            </h1>
            <p className="text-xs text-muted-foreground">
              Answer a few quick questions so we can safely triage your condition.
            </p>
          </div>
          <Badge variant="secondary" className="text-[11px]">
            {answeredCount}/{totalQuestions} answered
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {isAnalyzing ? (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              Analyzing Symptoms
            </CardTitle>
            <CardDescription className="text-xs">
              Generating a personalized set of questions based on your selections.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <Badge key={symptom.id} variant="outline">
                {symptom.label}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {selectedSymptoms.map((symptom) => {
            const symptomAnswers = answers[symptom.id] || {};

            return (
              <Card key={symptom.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{symptom.label}</CardTitle>
                      <CardDescription className="text-xs">
                        {symptom.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-[11px]">
                      {Object.keys(symptomAnswers).length}/{symptom.questions.length} complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {symptom.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <p className="text-sm font-medium">{q.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => {
                          const selected = symptomAnswers[q.id] === opt.score;
                          const levelLabel =
                            opt.score === 1 ? "Mild" : opt.score === 2 ? "Moderate" : "High";
                          return (
                            <Button
                              key={opt.label}
                              size="sm"
                              variant={selected ? "default" : "outline"}
                              onClick={() => handleAnswer(symptom.id, q.id, opt.score)}
                            >
                              <span className="mr-1 text-xs opacity-70">{levelLabel}</span>
                              {opt.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button
          size="lg"
          className="gap-2"
          disabled={!canContinue}
          onClick={handleAnalyze}
          data-testid="button-get-analysis"
        >
          Get Analysis
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

