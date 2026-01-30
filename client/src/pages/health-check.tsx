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
  Check,
  AlertCircle,
  Loader2,
  RotateCcw
} from "lucide-react";
import type { UserContext, Lifestyle, SymptomInput } from "@shared/schema";
import { symptoms as symptomList } from "@/lib/quiz-data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Step = "profile" | "lifestyle" | "symptoms" | "processing";

interface FormData {
  ageRange: UserContext["ageRange"] | null;
  gender: UserContext["gender"] | null;
  cityTier: UserContext["cityTier"] | null;
  sleepQuality: Lifestyle["sleepQuality"];
  stressLevel: Lifestyle["stressLevel"];
  activityLevel: Lifestyle["activityLevel"];
  primaryGoal: UserContext["primaryGoal"];
}

const STORAGE_KEY = "healthCheckFormData";
const SYMPTOMS_KEY = "healthCheckSymptoms";
const STEP_KEY = "healthCheckStep";

// Smart defaults based on common user patterns
const defaultFormData: FormData = {
  ageRange: null,
  gender: null,
  cityTier: null,
  sleepQuality: "good",
  stressLevel: "moderate", 
  activityLevel: "light",
  primaryGoal: "prevention",
};

const ageRanges = [
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "46-55", label: "46-55" },
  { value: "56-65", label: "56-65" },
  { value: "65+", label: "65+" },
] as const;

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Skip" },
] as const;

const cityTiers = [
  { value: "tier1", label: "Metro", description: "Delhi, Mumbai, Bangalore" },
  { value: "tier2", label: "Tier 2", description: "Jaipur, Lucknow, Pune" },
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
  { value: "sedentary", label: "Sedentary", description: "Little exercise" },
  { value: "light", label: "Light", description: "1-2 days/week" },
  { value: "moderate", label: "Moderate", description: "3-4 days/week" },
  { value: "active", label: "Active", description: "5+ days/week" },
] as const;

const goalOptions = [
  { value: "prevention", label: "Stay Healthy", description: "Prevent issues before they start" },
  { value: "current_discomfort", label: "Address Symptoms", description: "I have current concerns" },
  { value: "long_term_wellness", label: "Optimize Health", description: "Long-term wellness focus" },
] as const;

export default function HealthCheck() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("profile");
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [freeText, setFreeText] = useState("");
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    
    if (savedForm || savedStep) {
      try {
        const parsed = savedForm ? JSON.parse(savedForm) : {};
        // Only show restore prompt if user had made progress
        if (parsed.ageRange || parsed.cityTier || (savedStep && savedStep !== "profile")) {
          setShowRestorePrompt(true);
          setHasRestoredData(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save progress on every change
  const saveProgress = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(SYMPTOMS_KEY, JSON.stringify({ symptoms: selectedSymptoms, freeText }));
    localStorage.setItem(STEP_KEY, step);
  }, [formData, selectedSymptoms, freeText, step]);

  useEffect(() => {
    if (formData.ageRange || selectedSymptoms.length > 0 || step !== "profile") {
      saveProgress();
    }
  }, [formData, selectedSymptoms, freeText, step, saveProgress]);

  const restoreProgress = () => {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    const savedSymptoms = localStorage.getItem(SYMPTOMS_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    
    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (e) {}
    }
    if (savedSymptoms) {
      try {
        const parsed = JSON.parse(savedSymptoms);
        setSelectedSymptoms(parsed.symptoms || []);
        setFreeText(parsed.freeText || "");
      } catch (e) {}
    }
    if (savedStep && ["profile", "lifestyle", "symptoms"].includes(savedStep)) {
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
    setStep("profile");
    setShowRestorePrompt(false);
  };

  const createCaseMutation = useMutation({
    mutationFn: async (data: { userContext: UserContext; symptomInput: SymptomInput }) => {
      const response = await apiRequest("POST", "/api/health-check/create", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Clear saved progress on success
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SYMPTOMS_KEY);
      localStorage.removeItem(STEP_KEY);
      localStorage.setItem("healthCheckCase", JSON.stringify(data));
      navigate("/health-check/results");
    },
  });

  const progress = step === "profile" ? 25 : step === "lifestyle" ? 50 : step === "symptoms" ? 75 : 100;

  const canProceedProfile = formData.ageRange !== null && formData.cityTier !== null;
  const canProceedLifestyle = true; // All have defaults
  const canSubmit = selectedSymptoms.length > 0;

  const handleNext = () => {
    if (step === "profile" && canProceedProfile) {
      setStep("lifestyle");
    } else if (step === "lifestyle") {
      setStep("symptoms");
    }
  };

  const handleBack = () => {
    if (step === "lifestyle") {
      setStep("profile");
    } else if (step === "symptoms") {
      setStep("lifestyle");
    } else {
      navigate("/");
    }
  };

  const toggleSymptom = (id: number) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!formData.ageRange || !formData.cityTier) return;

    const userContext: UserContext = {
      ageRange: formData.ageRange,
      gender: formData.gender || undefined,
      cityTier: formData.cityTier,
      lifestyle: {
        sleepQuality: formData.sleepQuality,
        stressLevel: formData.stressLevel,
        activityLevel: formData.activityLevel,
      },
      primaryGoal: formData.primaryGoal,
    };

    const symptomInput: SymptomInput = {
      selectedSymptomIds: selectedSymptoms,
      freeText: freeText || undefined,
    };

    setStep("processing");
    createCaseMutation.mutate({ userContext, symptomInput });
  };

  // Compact chip selector for horizontal options
  const ChipOption = ({ 
    value, 
    label, 
    isSelected, 
    onClick,
    size = "default"
  }: { 
    value: string; 
    label: string; 
    isSelected: boolean; 
    onClick: () => void;
    size?: "default" | "sm";
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 rounded-lg border-2 font-medium transition-all duration-150
        ${size === "sm" ? "text-xs" : "text-sm"}
        ${isSelected 
          ? "border-primary bg-primary text-primary-foreground" 
          : "border-border bg-background hover-elevate"
        }
      `}
      data-testid={`button-option-${value}`}
    >
      {label}
    </button>
  );

  // Card option for options with descriptions
  const CardOption = ({
    value,
    label,
    description,
    isSelected,
    onClick,
  }: {
    value: string;
    label: string;
    description?: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full p-3 rounded-lg border-2 text-left transition-all duration-150
        ${isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border bg-background hover-elevate"
        }
      `}
      data-testid={`button-option-${value}`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
          ${isSelected ? "border-primary bg-primary" : "border-muted-foreground"}`}>
          {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
        </div>
        <div>
          <div className="font-medium text-sm">{label}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
      </div>
    </button>
  );

  // Restore prompt overlay
  if (showRestorePrompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              Continue where you left off?
            </CardTitle>
            <CardDescription>
              We found your previous health check progress. Would you like to continue or start fresh?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={startFresh} className="flex-1" data-testid="button-start-fresh">
              Start Fresh
            </Button>
            <Button onClick={restoreProgress} className="flex-1" data-testid="button-restore">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile Step - Combines age, gender, city into one screen
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-serif font-semibold">Quick Profile</h2>
        <p className="text-muted-foreground text-sm">Tell us about yourself</p>
      </div>

      {/* Age Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          Age Range <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ageRanges.map(opt => (
            <ChipOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              isSelected={formData.ageRange === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, ageRange: opt.value }))}
            />
          ))}
        </div>
      </div>

      {/* Gender - Optional */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          Gender <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map(opt => (
            <ChipOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              isSelected={formData.gender === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, gender: opt.value }))}
            />
          ))}
        </div>
      </div>

      {/* City Tier */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cityTiers.map(opt => (
            <CardOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              isSelected={formData.cityTier === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, cityTier: opt.value }))}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Lifestyle Step - Sleep, stress, activity, goal with smart defaults
  const renderLifestyle = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-serif font-semibold">Lifestyle & Goals</h2>
        <p className="text-muted-foreground text-sm">We've pre-selected common answers. Adjust if needed.</p>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Moon className="w-4 h-4" />
          Sleep Quality
        </label>
        <div className="flex gap-2">
          {sleepOptions.map(opt => (
            <ChipOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              isSelected={formData.sleepQuality === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, sleepQuality: opt.value }))}
            />
          ))}
        </div>
      </div>

      {/* Stress Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Stress Level
        </label>
        <div className="flex gap-2">
          {stressOptions.map(opt => (
            <ChipOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              isSelected={formData.stressLevel === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, stressLevel: opt.value }))}
            />
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Physical Activity</label>
        <div className="grid grid-cols-2 gap-2">
          {activityOptions.map(opt => (
            <CardOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              isSelected={formData.activityLevel === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, activityLevel: opt.value }))}
            />
          ))}
        </div>
      </div>

      {/* Primary Goal */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4" />
          What brings you here?
        </label>
        <div className="space-y-2">
          {goalOptions.map(opt => (
            <CardOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              isSelected={formData.primaryGoal === opt.value}
              onClick={() => setFormData(prev => ({ ...prev, primaryGoal: opt.value }))}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Symptoms Step
  const renderSymptoms = () => {
    const groupedSymptoms = symptomList.reduce((acc, symptom) => {
      if (!acc[symptom.category]) {
        acc[symptom.category] = [];
      }
      acc[symptom.category].push(symptom);
      return acc;
    }, {} as Record<string, typeof symptomList>);

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-serif font-semibold">Current Symptoms</h2>
          <p className="text-muted-foreground text-sm">Select any symptoms you're experiencing</p>
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
            <span className="text-xs text-muted-foreground">Selected ({selectedSymptoms.length}):</span>
            {selectedSymptoms.slice(0, 5).map(id => {
              const symptom = symptomList.find(s => s.id === id);
              return symptom ? (
                <Badge 
                  key={id} 
                  variant="secondary" 
                  className="text-xs cursor-pointer"
                  onClick={() => toggleSymptom(id)}
                >
                  {symptom.name} ×
                </Badge>
              ) : null;
            })}
            {selectedSymptoms.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedSymptoms.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="py-2 px-4 bg-muted/30">
                <CardTitle className="text-xs font-medium capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 grid grid-cols-1 gap-1">
                {categorySymptoms.map(symptom => (
                  <div
                    key={symptom.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                      ${selectedSymptoms.includes(symptom.id) 
                        ? "bg-primary/10" 
                        : "hover:bg-muted/50"
                      }`}
                    onClick={() => toggleSymptom(symptom.id)}
                    data-testid={`symptom-${symptom.id}`}
                  >
                    <Checkbox
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={() => toggleSymptom(symptom.id)}
                    />
                    <span className="text-sm">{symptom.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Details (Optional)</label>
          <Textarea
            placeholder="Any other symptoms or context you'd like to share..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            className="min-h-[80px]"
            data-testid="textarea-freetext"
          />
        </div>
      </div>
    );
  };

  // Processing Step with better feedback
  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Stethoscope className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-serif font-semibold">Analyzing Your Health</h2>
        <p className="text-muted-foreground text-sm">This usually takes 2-3 seconds...</p>
      </div>
      <div className="space-y-2 text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
        <Skeleton className="h-4 w-44 mx-auto" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {step !== "processing" && (
                <span className="text-sm text-muted-foreground">
                  {step === "profile" ? "Step 1 of 3" : step === "lifestyle" ? "Step 2 of 3" : "Step 3 of 3"}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            {step === "profile" && renderProfile()}
            {step === "lifestyle" && renderLifestyle()}
            {step === "symptoms" && renderSymptoms()}
            {step === "processing" && renderProcessing()}
          </CardContent>
        </Card>

        {/* Navigation */}
        {step !== "processing" && (
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step === "profile" && (
              <Button
                onClick={handleNext}
                disabled={!canProceedProfile}
                className="flex-1"
                data-testid="button-next"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {step === "lifestyle" && (
              <Button
                onClick={handleNext}
                className="flex-1"
                data-testid="button-next"
              >
                Continue to Symptoms
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {step === "symptoms" && (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || createCaseMutation.isPending}
                className="flex-1"
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
            )}
          </div>
        )}

        {/* Error State */}
        {createCaseMutation.isError && (
          <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive text-center">
              Something went wrong. Please try again.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              This is not a medical diagnosis. Our analysis provides health insights based on Ayurvedic principles. Always consult a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
