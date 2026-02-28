import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { symptomDefinitions } from "@/lib/symptom-flow";
import { useSymptomFlow } from "@/context/SymptomFlowContext";
import { AlertTriangle, Brain, Wind, Flame, ArrowRight, ArrowLeft, Search } from "lucide-react";
import FlowStepper from "@/components/flow-stepper";

export default function SymptomSelection() {
  const [, navigate] = useLocation();
  const { selection, setSelection, setAnswers, setAnalysis, setDoctorVerified, username } = useSymptomFlow();
  const [searchTerm, setSearchTerm] = useState("");

  if (!username) {
    navigate("/patient");
    return null;
  }

  useEffect(() => {
    // Reset assessment state when arriving at the first step
    setAnswers({});
    setAnalysis(null);
    setDoctorVerified(false);
  }, [setAnswers, setAnalysis, setDoctorVerified]);

  const toggleSymptom = (id: string) => {
    const exists = selection.selectedSymptomIds.includes(id);
    const nextIds = exists
      ? selection.selectedSymptomIds.filter((s) => s !== id)
      : [...selection.selectedSymptomIds, id];
    setSelection({ selectedSymptomIds: nextIds });
  };

  const getDoshaLabel = (dosha: "vata" | "pitta" | "kapha") => {
    if (dosha === "vata") return "Vata imbalance";
    if (dosha === "pitta") return "Pitta imbalance";
    return "Kapha imbalance";
  };

  const getDoshaBadgeIcon = (dosha: "vata" | "pitta" | "kapha") => {
    if (dosha === "vata") return <Wind className="w-3 h-3" />;
    if (dosha === "pitta") return <Flame className="w-3 h-3" />;
    return <Brain className="w-3 h-3" />;
  };

  const filteredSymptoms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return symptomDefinitions;
    return symptomDefinitions.filter((symptom) => {
      const content = `${symptom.label} ${symptom.description} ${symptom.dosha}`.toLowerCase();
      return content.includes(term);
    });
  }, [searchTerm]);

  const canAnalyze = selection.selectedSymptomIds.length > 0;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/health-dashboard")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <FlowStepper
        steps={["Intake", "Symptoms", "Assessment", "Results"]}
        currentStep={1}
        className="mb-6"
      />

      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-3 text-[11px]">
          Step 2 of 4 • Symptoms
        </Badge>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">
          What are you feeling today?
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Select the symptoms that match your current experience. We&apos;ll use this to
          understand which doshas are imbalanced.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms by name or description"
            className="pl-9"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Start typing to filter the symptom list.
        </p>
      </div>

      <Card className="mb-6 border-amber-200 bg-amber-50/60">
        <CardContent className="pt-4 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-900">
            This tool is for **early wellness awareness** and is not a medical emergency
            service. If you feel chest pain, severe breathlessness, or sudden weakness,
            please seek emergency care immediately.
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {filteredSymptoms.map((symptom) => {
          const selected = selection.selectedSymptomIds.includes(symptom.id);
          const doshaLabel = getDoshaLabel(symptom.dosha);

          return (
            <button
              key={symptom.id}
              type="button"
              onClick={() => toggleSymptom(symptom.id)}
              className="text-left group focus:outline-none"
              data-testid={`card-symptom-${symptom.id}`}
            >
              <Card
                className={`h-full transition-all hover-elevate ${
                  selected ? "border-primary shadow-sm" : "border-border/70"
                }`}
              >
                <CardHeader className="pb-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold">{symptom.label}</CardTitle>
                    {selected && (
                      <Badge className="text-[11px]" variant="outline">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="inline-flex items-center gap-1 text-[11px] capitalize"
                  >
                    {getDoshaBadgeIcon(symptom.dosha)}
                    {doshaLabel}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs leading-relaxed">
                    {symptom.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {filteredSymptoms.length === 0 && (
        <Card className="mb-8">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            No symptoms match your search. Try a different keyword.
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {selection.selectedSymptomIds.length} symptom
            {selection.selectedSymptomIds.length === 1 ? "" : "s"}
          </span>
        </p>
        <Button
          size="lg"
          className="gap-2"
          disabled={!canAnalyze}
          onClick={() => navigate("/assessment")}
          data-testid="button-analyze-symptoms"
        >
          Analyze Symptoms
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

