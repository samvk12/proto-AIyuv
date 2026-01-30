import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertCircle
} from "lucide-react";
import type { UserContext, Lifestyle, SymptomInput } from "@shared/schema";
import { symptoms as symptomList } from "@/lib/quiz-data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Step = "context" | "symptoms" | "processing" | "results";

interface ContextFormData {
  ageRange: UserContext["ageRange"] | null;
  gender: UserContext["gender"] | null;
  cityTier: UserContext["cityTier"] | null;
  sleepQuality: Lifestyle["sleepQuality"] | null;
  stressLevel: Lifestyle["stressLevel"] | null;
  activityLevel: Lifestyle["activityLevel"] | null;
  primaryGoal: UserContext["primaryGoal"] | null;
}

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
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

const cityTiers = [
  { value: "tier1", label: "Metro City", description: "Delhi, Mumbai, Bangalore, etc." },
  { value: "tier2", label: "Tier 2 City", description: "Jaipur, Lucknow, Pune, etc." },
  { value: "tier3", label: "Tier 3 City", description: "Smaller cities and towns" },
  { value: "rural", label: "Rural Area", description: "Village or rural region" },
] as const;

const sleepOptions = [
  { value: "poor", label: "Poor", description: "Less than 5 hours, restless" },
  { value: "fair", label: "Fair", description: "5-6 hours, sometimes restless" },
  { value: "good", label: "Good", description: "7-8 hours, mostly restful" },
  { value: "excellent", label: "Excellent", description: "8+ hours, very restful" },
] as const;

const stressOptions = [
  { value: "low", label: "Low", description: "Rarely stressed" },
  { value: "moderate", label: "Moderate", description: "Sometimes stressed" },
  { value: "high", label: "High", description: "Often stressed" },
  { value: "very_high", label: "Very High", description: "Constantly stressed" },
] as const;

const activityOptions = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "light", label: "Light", description: "Light exercise 1-2 days/week" },
  { value: "moderate", label: "Moderate", description: "Moderate exercise 3-4 days/week" },
  { value: "active", label: "Active", description: "Intense exercise 5+ days/week" },
] as const;

const goalOptions = [
  { value: "prevention", label: "Prevention", description: "Stay healthy, prevent issues" },
  { value: "current_discomfort", label: "Current Discomfort", description: "Address existing symptoms" },
  { value: "long_term_wellness", label: "Long-term Wellness", description: "Optimize overall health" },
] as const;

export default function HealthCheck() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("context");
  const [contextStep, setContextStep] = useState(0);
  const [formData, setFormData] = useState<ContextFormData>({
    ageRange: null,
    gender: null,
    cityTier: null,
    sleepQuality: null,
    stressLevel: null,
    activityLevel: null,
    primaryGoal: null,
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [freeText, setFreeText] = useState("");

  const createCaseMutation = useMutation({
    mutationFn: async (data: { userContext: UserContext; symptomInput: SymptomInput }) => {
      const response = await apiRequest("POST", "/api/health-check/create", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("healthCheckCase", JSON.stringify(data));
      navigate("/health-check/results");
    },
  });

  const contextSteps = [
    { key: "age", icon: User, title: "Your Age", subtitle: "Select your age range" },
    { key: "gender", icon: User, title: "Gender", subtitle: "Optional - helps personalize recommendations" },
    { key: "location", icon: MapPin, title: "Location", subtitle: "Your city tier affects lifestyle recommendations" },
    { key: "sleep", icon: Moon, title: "Sleep Quality", subtitle: "How well do you typically sleep?" },
    { key: "stress", icon: Activity, title: "Stress Level", subtitle: "Your current stress situation" },
    { key: "activity", icon: Activity, title: "Activity Level", subtitle: "Your physical activity routine" },
    { key: "goal", icon: Target, title: "Primary Goal", subtitle: "What brings you here today?" },
  ];

  const totalContextSteps = contextSteps.length;
  const progress = step === "context" 
    ? ((contextStep + 1) / (totalContextSteps + 1)) * 50
    : step === "symptoms" 
    ? 75 
    : 100;

  const handleContextNext = () => {
    if (contextStep < totalContextSteps - 1) {
      setContextStep(contextStep + 1);
    } else {
      setStep("symptoms");
    }
  };

  const handleContextBack = () => {
    if (contextStep > 0) {
      setContextStep(contextStep - 1);
    } else {
      navigate("/");
    }
  };

  const canProceedContext = () => {
    switch (contextStep) {
      case 0: return formData.ageRange !== null;
      case 1: return true;
      case 2: return formData.cityTier !== null;
      case 3: return formData.sleepQuality !== null;
      case 4: return formData.stressLevel !== null;
      case 5: return formData.activityLevel !== null;
      case 6: return formData.primaryGoal !== null;
      default: return false;
    }
  };

  const toggleSymptom = (id: number) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!formData.ageRange || !formData.cityTier || !formData.sleepQuality || 
        !formData.stressLevel || !formData.activityLevel || !formData.primaryGoal) {
      return;
    }

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

  const renderOptionButton = (
    value: string,
    label: string,
    description: string | undefined,
    isSelected: boolean,
    onClick: () => void
  ) => (
    <Button
      key={value}
      variant={isSelected ? "default" : "outline"}
      className={`w-full justify-start text-left h-auto py-4 px-4 ${isSelected ? "" : "hover-elevate"}`}
      onClick={onClick}
      data-testid={`button-option-${value}`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary-foreground bg-primary-foreground" : "border-muted-foreground"}`}>
          {isSelected && <Check className="w-3 h-3 text-primary" />}
        </div>
        <div className="flex-1">
          <div className="font-medium">{label}</div>
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
      </div>
    </Button>
  );

  const renderContextStep = () => {
    const currentStep = contextSteps[contextStep];
    const Icon = currentStep.icon;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-serif font-semibold">{currentStep.title}</h2>
          <p className="text-muted-foreground">{currentStep.subtitle}</p>
        </div>

        <div className="space-y-3">
          {contextStep === 0 && ageRanges.map(opt => 
            renderOptionButton(opt.value, opt.label, undefined, formData.ageRange === opt.value, 
              () => setFormData(prev => ({ ...prev, ageRange: opt.value })))
          )}
          
          {contextStep === 1 && genderOptions.map(opt => 
            renderOptionButton(opt.value, opt.label, undefined, formData.gender === opt.value,
              () => setFormData(prev => ({ ...prev, gender: opt.value })))
          )}
          
          {contextStep === 2 && cityTiers.map(opt => 
            renderOptionButton(opt.value, opt.label, opt.description, formData.cityTier === opt.value,
              () => setFormData(prev => ({ ...prev, cityTier: opt.value })))
          )}
          
          {contextStep === 3 && sleepOptions.map(opt => 
            renderOptionButton(opt.value, opt.label, opt.description, formData.sleepQuality === opt.value,
              () => setFormData(prev => ({ ...prev, sleepQuality: opt.value })))
          )}
          
          {contextStep === 4 && stressOptions.map(opt => 
            renderOptionButton(opt.value, opt.label, opt.description, formData.stressLevel === opt.value,
              () => setFormData(prev => ({ ...prev, stressLevel: opt.value })))
          )}
          
          {contextStep === 5 && activityOptions.map(opt => 
            renderOptionButton(opt.value, opt.label, opt.description, formData.activityLevel === opt.value,
              () => setFormData(prev => ({ ...prev, activityLevel: opt.value })))
          )}
          
          {contextStep === 6 && goalOptions.map(opt => 
            renderOptionButton(opt.value, opt.label, opt.description, formData.primaryGoal === opt.value,
              () => setFormData(prev => ({ ...prev, primaryGoal: opt.value })))
          )}
        </div>
      </div>
    );
  };

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
          <p className="text-muted-foreground">Select any symptoms you're experiencing</p>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="py-3 px-4 bg-muted/30">
                <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 grid grid-cols-1 gap-2">
                {categorySymptoms.map(symptom => (
                  <div
                    key={symptom.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer"
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
            placeholder="Describe any other symptoms or concerns..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            className="min-h-[100px]"
            data-testid="textarea-freetext"
          />
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Selected:</span>
            {selectedSymptoms.map(id => {
              const symptom = symptomList.find(s => s.id === id);
              return symptom ? (
                <Badge key={id} variant="secondary" className="text-xs">
                  {symptom.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-serif font-semibold">Analyzing Your Health Profile</h2>
        <p className="text-muted-foreground">Please wait while we process your information...</p>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>Evaluating Ayurvedic patterns...</p>
        <p>Running medical screening...</p>
        <p>Generating personalized insights...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {step === "context" ? `Step ${contextStep + 1} of ${totalContextSteps}` : 
               step === "symptoms" ? "Symptoms" : "Processing"}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-6">
            {step === "context" && renderContextStep()}
            {step === "symptoms" && renderSymptoms()}
            {step === "processing" && renderProcessing()}
          </CardContent>
        </Card>

        {step !== "processing" && (
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={step === "context" ? handleContextBack : () => setStep("context")}
              className="flex-1"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step === "context" ? (
              <Button
                onClick={handleContextNext}
                disabled={!canProceedContext()}
                className="flex-1"
                data-testid="button-next"
              >
                {contextStep === totalContextSteps - 1 ? "Continue" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={selectedSymptoms.length === 0 || createCaseMutation.isPending}
                className="flex-1"
                data-testid="button-submit"
              >
                {createCaseMutation.isPending ? "Processing..." : "Get Analysis"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              This is not a medical diagnosis. Our analysis provides health insights based on Ayurvedic principles and general wellness guidelines. Always consult a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
