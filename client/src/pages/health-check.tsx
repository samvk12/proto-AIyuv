import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  MapPin, 
  Moon, 
  Activity,
  Target,
  Stethoscope,
  Loader2,
  RotateCcw
} from "lucide-react";
import type { UserContext, SymptomInput, Symptom } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// ========================
// SECTION 2 & 3: CONTEXT COLLECTION + SYMPTOM INPUT
// Reference: Spec Sections 2 and 3
// ========================

type Step = "context" | "symptoms" | "processing";

interface FormData {
  ageRange: UserContext["ageRange"] | null;
  gender: UserContext["gender"] | null;
  cityTier: UserContext["cityTier"] | null;
  sleepQuality: UserContext["sleepQuality"];
  stressLevel: UserContext["stressLevel"];
  activityLevel: UserContext["activityLevel"];
  primaryGoal: UserContext["primaryGoal"];
}

const STORAGE_KEY = "healthCheckFormData";
const SYMPTOMS_KEY = "healthCheckSymptoms";
const STEP_KEY = "healthCheckStep";

const defaultFormData: FormData = {
  ageRange: null,
  gender: null,
  cityTier: null,
  sleepQuality: "good",
  stressLevel: "moderate",
  activityLevel: "light",
  primaryGoal: "prevention",
};

const ageOptions = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"] as const;
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

const cityTierOptions = [
  { value: "tier1", label: "Tier 1", description: "Metro cities" },
  { value: "tier2", label: "Tier 2", description: "Large cities" },
  { value: "tier3", label: "Tier 3", description: "Smaller cities" },
  { value: "rural", label: "Rural", description: "Village area" },
] as const;

const sleepOptions = [
  { value: "poor", label: "Poor" },
  { value: "fair", label: "Fair" },
  { value: "good", label: "Good" },
  { value: "excellent", label: "Excellent" },
] as const;

const stressOptions = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "very_high", label: "Very High" },
] as const;

const activityOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
] as const;

const goalOptions = [
  { value: "prevention", label: "Prevention", description: "Stay healthy, prevent issues" },
  { value: "current_discomfort", label: "Current Discomfort", description: "Address current symptoms" },
  { value: "long_term_wellness", label: "Long-term Wellness", description: "Build sustainable health" },
] as const;

export default function HealthCheck() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("context");
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [freeText, setFreeText] = useState("");
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  // Fetch symptoms list from API
  const { data: symptoms = [], isLoading: symptomsLoading } = useQuery<Symptom[]>({
    queryKey: ["/api/symptoms"],
  });

  // Load saved progress on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    
    if (savedForm || (savedStep && savedStep !== "context")) {
      setShowRestorePrompt(true);
    }
  }, []);

  // Save progress
  const saveProgress = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(SYMPTOMS_KEY, JSON.stringify({ symptoms: selectedSymptoms, freeText }));
    localStorage.setItem(STEP_KEY, step);
  }, [formData, selectedSymptoms, freeText, step]);

  useEffect(() => {
    if (formData.ageRange || selectedSymptoms.length > 0 || step !== "context") {
      saveProgress();
    }
  }, [formData, selectedSymptoms, freeText, step, saveProgress]);

  const restoreProgress = () => {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    const savedSymptoms = localStorage.getItem(SYMPTOMS_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    
    if (savedForm) {
      try { setFormData(JSON.parse(savedForm)); } catch (e) {}
    }
    if (savedSymptoms) {
      try {
        const parsed = JSON.parse(savedSymptoms);
        setSelectedSymptoms(parsed.symptoms || []);
        setFreeText(parsed.freeText || "");
      } catch (e) {}
    }
    if (savedStep && ["context", "symptoms"].includes(savedStep)) {
      setStep(savedStep as Step);
    }
    setShowRestorePrompt(false);
  };

  const startFresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SYMPTOMS_KEY);
    localStorage.removeItem(STEP_KEY);
    setFormData(defaultFormData);
    setSelectedSymptoms([]);
    setFreeText("");
    setStep("context");
    setShowRestorePrompt(false);
  };

  // Create case mutation
  const createCaseMutation = useMutation({
    mutationFn: async () => {
      // First create the case with context
      const caseResponse = await apiRequest("POST", "/api/case/create", {
        userContext: {
          ageRange: formData.ageRange!,
          gender: formData.gender || undefined,
          cityTier: formData.cityTier!,
          sleepQuality: formData.sleepQuality,
          stressLevel: formData.stressLevel,
          activityLevel: formData.activityLevel,
          primaryGoal: formData.primaryGoal,
        },
      });
      const caseData = await caseResponse.json();

      // Then submit symptoms
      const symptomsResponse = await apiRequest(
        "POST",
        `/api/case/${caseData.id}/symptoms`,
        {
          selectedSymptomIds: selectedSymptoms,
          freeText: freeText || undefined,
        }
      );
      return symptomsResponse.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SYMPTOMS_KEY);
      localStorage.removeItem(STEP_KEY);
      localStorage.setItem("healthCheckCase", JSON.stringify(data));
      navigate("/health-check/results");
    },
  });

  const handleSubmit = () => {
    setStep("processing");
    createCaseMutation.mutate();
  };

  const canProceedFromContext = formData.ageRange && formData.cityTier;
  const canSubmit = selectedSymptoms.length > 0;
  const progress = step === "context" ? 33 : step === "symptoms" ? 66 : 100;

  // Group symptoms by category
  const symptomsByCategory: Record<string, Symptom[]> = {};
  symptoms.forEach((s) => {
    if (!symptomsByCategory[s.category]) symptomsByCategory[s.category] = [];
    symptomsByCategory[s.category].push(s);
  });

  // Restore prompt
  if (showRestorePrompt) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <RotateCcw className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Continue Where You Left Off?</CardTitle>
            <CardDescription>
              We found your previous progress. Would you like to continue?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={restoreProgress} data-testid="button-continue-progress">
              Continue My Progress
            </Button>
            <Button variant="outline" onClick={startFresh} data-testid="button-start-fresh">
              Start Fresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      {/* Progress bar - Clean visual indicator */}
      <div className="mb-10">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-medium text-foreground">
            Step {step === "context" ? 1 : 2} of 2
          </span>
          <span className="text-muted-foreground">{progress}% complete</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      {/* Context Collection - Spec Section 2 */}
      {step === "context" && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-foreground">
              Tell Us About Yourself
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              This helps us personalize your health insights and recommendations
            </p>
          </div>

          {/* Age Range */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Age Range</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ageOptions.map((age) => (
                  <Button
                    key={age}
                    variant={formData.ageRange === age ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, ageRange: age })}
                    data-testid={`button-age-${age}`}
                  >
                    {age}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gender (Optional) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Gender</CardTitle>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => (
                  <Button
                    key={g.value}
                    variant={formData.gender === g.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, gender: g.value })}
                    data-testid={`button-gender-${g.value}`}
                  >
                    {g.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* City Tier */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Where do you live?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {cityTierOptions.map((tier) => (
                  <Button
                    key={tier.value}
                    variant={formData.cityTier === tier.value ? "default" : "outline"}
                    className="h-auto py-3 flex-col items-start"
                    onClick={() => setFormData({ ...formData, cityTier: tier.value })}
                    data-testid={`button-city-${tier.value}`}
                  >
                    <span className="font-medium">{tier.label}</span>
                    <span className="text-xs opacity-70">{tier.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Lifestyle</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Sleep Quality</p>
                <div className="flex flex-wrap gap-2">
                  {sleepOptions.map((s) => (
                    <Button
                      key={s.value}
                      variant={formData.sleepQuality === s.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, sleepQuality: s.value })}
                      data-testid={`button-sleep-${s.value}`}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Stress Level</p>
                <div className="flex flex-wrap gap-2">
                  {stressOptions.map((s) => (
                    <Button
                      key={s.value}
                      variant={formData.stressLevel === s.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, stressLevel: s.value })}
                      data-testid={`button-stress-${s.value}`}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Activity Level</p>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.map((a) => (
                    <Button
                      key={a.value}
                      variant={formData.activityLevel === a.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, activityLevel: a.value })}
                      data-testid={`button-activity-${a.value}`}
                    >
                      {a.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Goal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Primary Health Goal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {goalOptions.map((g) => (
                  <Button
                    key={g.value}
                    variant={formData.primaryGoal === g.value ? "default" : "outline"}
                    className="w-full h-auto py-3 justify-start"
                    onClick={() => setFormData({ ...formData, primaryGoal: g.value })}
                    data-testid={`button-goal-${g.value}`}
                  >
                    <div className="text-left">
                      <span className="font-medium block">{g.label}</span>
                      <span className="text-xs opacity-70">{g.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate("/")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!canProceedFromContext}
              onClick={() => setStep("symptoms")}
              data-testid="button-next"
            >
              Continue to Symptoms
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Symptom Input - Spec Section 3 */}
      {step === "symptoms" && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-foreground">
              Describe Your Symptoms
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select any symptoms you're currently experiencing
            </p>
          </div>

          {symptomsLoading ? (
            <Card>
              <CardContent className="py-8">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(symptomsByCategory).map(([category, categorySymptoms]) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categorySymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`symptom-${symptom.id}`}
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={(checked) => {
                            setSelectedSymptoms(
                              checked
                                ? [...selectedSymptoms, symptom.id]
                                : selectedSymptoms.filter((id) => id !== symptom.id)
                            );
                          }}
                          data-testid={`checkbox-symptom-${symptom.id}`}
                        />
                        <label
                          htmlFor={`symptom-${symptom.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {symptom.name}
                        </label>
                        {symptom.relatedDosha && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {symptom.relatedDosha}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Selected symptoms summary - Visual feedback */}
          {selectedSymptoms.length > 0 && (
            <Card className="bg-accent/50 border-primary/20">
              <CardContent className="py-4">
                <p className="text-sm font-medium mb-3 text-foreground">
                  Selected: {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((id) => {
                    const symptom = symptoms.find((s) => s.id === id);
                    return symptom ? (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20 transition-colors"
                        onClick={() =>
                          setSelectedSymptoms(selectedSymptoms.filter((sid) => sid !== id))
                        }
                        data-testid={`badge-symptom-${id}`}
                      >
                        {symptom.name} ×
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Free text input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Details</CardTitle>
              <CardDescription>
                Describe any other symptoms or concerns (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Describe how you're feeling..."
                className="min-h-[100px]"
                data-testid="textarea-free-text"
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStep("context")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!canSubmit || createCaseMutation.isPending}
              onClick={handleSubmit}
              data-testid="button-submit"
            >
              {createCaseMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Processing - Clean loading state */}
      {step === "processing" && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3 text-foreground">
            Analyzing Your Health Profile
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Combining Ayurvedic wisdom with AI analysis to provide personalized insights...
          </p>
          {createCaseMutation.isError && (
            <div className="mt-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 max-w-sm mx-auto">
              <p className="text-destructive font-medium mb-4">Something went wrong. Please try again.</p>
              <Button onClick={() => setStep("symptoms")} variant="outline">
                Go Back
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
