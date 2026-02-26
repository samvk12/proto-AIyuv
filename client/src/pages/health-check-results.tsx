import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  Home,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Utensils,
  Moon,
  Activity,
  Brain,
  ChevronRight,
  Stethoscope,
  Camera,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Upload,
  Loader2,
  TrendingUp,
  Zap,
  Target
} from "lucide-react";
import type { HealthCheckCase } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// ========================
// SECTION 7 & 8: OUTPUT TO USER + NEXT STEPS
// Reference: Spec Sections 7 and 8
// ========================

const doshaColors = {
  vata: "bg-blue-500",
  pitta: "bg-red-500",
  kapha: "bg-primary",
};

const riskBadgeColors = {
  low: "bg-accent text-primary dark:bg-accent dark:text-primary",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const inputTypeLabels: Record<string, { label: string; description: string; icon: typeof Camera }> = {
  skin_image: { label: "Skin Photo", description: "Upload a clear photo of affected skin area", icon: Camera },
  tongue_image: { label: "Tongue Photo", description: "Upload a photo of your tongue for assessment", icon: Camera },
  doctor_consultation: { label: "Doctor Consultation", description: "Schedule a consultation with a practitioner", icon: MessageCircle },
};

const healthProgressData = [
  { day: "Mon", sleep: 7, steps: 4000, calories: 1800 },
  { day: "Tue", sleep: 6.5, steps: 6000, calories: 2000 },
  { day: "Wed", sleep: 8, steps: 8000, calories: 1900 },
  { day: "Thu", sleep: 7.5, steps: 7500, calories: 2100 },
  { day: "Fri", sleep: 7, steps: 9000, calories: 1850 },
  { day: "Sat", sleep: 8.5, steps: 5000, calories: 2200 },
  { day: "Sun", sleep: 8, steps: 10000, calories: 1950 },
];

export default function HealthCheckResults() {
  const [, navigate] = useLocation();
  const [caseData, setCaseData] = useState<HealthCheckCase | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [uploadedInputs, setUploadedInputs] = useState<Record<string, boolean>>({});
  const [isSubmittingInputs, setIsSubmittingInputs] = useState(false);
  const [goalStatus, setGoalStatus] = useState<"yes" | "no" | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const stored = localStorage.getItem("healthCheckCase");
    if (stored) {
      try {
        setCaseData(JSON.parse(stored));
      } catch (e) {
        navigate("/health-check");
      }
    } else {
      navigate("/health-check");
    }
  }, [navigate]);

  // Feedback mutation - Section 11
  const feedbackMutation = useMutation({
    mutationFn: async (wasHelpful: boolean) => {
      if (!caseData) return;
      const response = await apiRequest("POST", `/api/case/${caseData.id}/feedback`, {
        wasHelpful,
      });
      return response.json();
    },
    onSuccess: () => {
      setFeedbackSubmitted(true);
    },
  });

  // Advanced inputs submission - Section 4
  const advancedInputsMutation = useMutation({
    mutationFn: async (inputs: { skinImage?: string; tongueImage?: string; doctorConsultScheduled?: boolean }) => {
      if (!caseData) return;
      const response = await apiRequest("POST", `/api/case/${caseData.id}/advanced-inputs`, inputs);
      return response.json();
    },
    onSuccess: (data) => {
      if (data) {
        setCaseData(data);
        localStorage.setItem("healthCheckCase", JSON.stringify(data));
      }
    },
  });

  const handleFileUpload = (inputType: string) => {
    // Simulate file upload (stub - would integrate with actual file upload service)
    setUploadedInputs(prev => ({ ...prev, [inputType]: true }));
  };

  const handleSubmitAdvancedInputs = async () => {
    setIsSubmittingInputs(true);
    const inputs: { skinImage?: string; tongueImage?: string; doctorConsultScheduled?: boolean } = {};
    
    if (uploadedInputs.skin_image) {
      inputs.skinImage = "uploaded_skin_image_placeholder.jpg";
    }
    if (uploadedInputs.tongue_image) {
      inputs.tongueImage = "uploaded_tongue_image_placeholder.jpg";
    }
    if (uploadedInputs.doctor_consultation) {
      inputs.doctorConsultScheduled = true;
    }
    
    await advancedInputsMutation.mutateAsync(inputs);
    setIsSubmittingInputs(false);
  };

  if (!caseData) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p>Loading results...</p>
      </div>
    );
  }

  const { healthSnapshot, preventiveGuidance, diagnosisResult, nextStepsOptions, confirmationGate, medicalAwareness } = caseData;
  const medical = diagnosisResult?.medicalAssessment;

  const allRequiredInputsProvided = confirmationGate?.requiredInputs.every(
    input => uploadedInputs[input]
  ) ?? false;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl animate-fade-in">
      {/* Header - Clean success state */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-foreground" data-testid="text-results-heading">
          Health Management Dashboard
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Monitor your progress and manage your daily wellness goals
        </p>
      </div>

      {/* Health Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Health Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthProgressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Energy Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthProgressData.slice(-4)}>
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="day" fontSize={10} hide />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Target Check-in */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          {!goalStatus ? (
            <div className="text-center">
              <Target className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Daily Goal Review</h3>
              <p className="text-muted-foreground mb-6">Did you achieve your targets for yesterday?</p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="px-8"
                  onClick={() => setGoalStatus("yes")}
                  data-testid="button-goal-yes"
                >
                  Yes, I did!
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8"
                  onClick={() => setGoalStatus("no")}
                  data-testid="button-goal-no"
                >
                  Not quite
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-full ${goalStatus === "yes" ? "bg-green-100" : "bg-blue-100"}`}>
                  {goalStatus === "yes" ? (
                    <ThumbsUp className={`w-6 h-6 ${goalStatus === "yes" ? "text-green-600" : "text-blue-600"}`} />
                  ) : (
                    <Heart className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {goalStatus === "yes" ? "Great job! Keep the momentum going." : "Small steps lead to big changes. Let's adjust for today."}
                  </h3>
                  <p className="text-muted-foreground">
                    {goalStatus === "yes" ? "Your performance is consistent. Today's plan is optimized for peak performance." : "We've tailored a recovery plan to help you get back on track gently."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-primary" />
                    Today's Food Preferences
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {goalStatus === "yes" ? (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> High protein lean breakfast</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Complex carbohydrates for lunch</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Magnesium-rich evening snack</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Warm detox lemon water</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Light steamed vegetables</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Anti-inflammatory turmeric milk</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-background border">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-primary" />
                    Today's Lifestyle Habits
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {goalStatus === "yes" ? (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Increase workout intensity</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> 15-min focused meditation</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Optimize workspace ergonomics</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Focus on deep hydration</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> 20-min gentle evening walk</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Digital detox 1h before bed</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-xs"
                onClick={() => setGoalStatus(null)}
              >
                Change response
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto">
        {/* Section 7.1: Health Snapshot */}
        {healthSnapshot && (
          <Card className="mb-6" data-testid="card-health-snapshot">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <CardTitle>Ayurvedic Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{healthSnapshot.summary}</p>

              {/* Dosha Imbalance */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Dosha Imbalance Detected</p>
                <div className="flex items-center gap-3">
                  <Badge className={`${doshaColors[healthSnapshot.doshaImbalance.primary]} text-white capitalize`}>
                    {healthSnapshot.doshaImbalance.primary}
                  </Badge>
                  <span className="text-sm capitalize">{healthSnapshot.doshaImbalance.level} level</span>
                </div>
              </div>

              {/* Dosha Visualization */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Current Balance</p>
                {(["vata", "pitta", "kapha"] as const).map((dosha) => (
                  <div key={dosha} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{dosha}</span>
                      <span>{healthSnapshot.doshaVisualization[dosha]}%</span>
                    </div>
                    <Progress
                      value={healthSnapshot.doshaVisualization[dosha]}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>

              {/* Risk Level */}
              {medical && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium">Risk Level:</span>
                  <Badge className={riskBadgeColors[medical.riskLevel]}>
                    {medical.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 4: Confirmation Gate - Advanced Inputs UI */}
        {confirmationGate?.triggered && !confirmationGate.inputsProvided && (
          <Card className="mb-6 border-yellow-500/50" data-testid="card-confirmation-gate">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <CardTitle className="text-lg">Additional Verification Needed</CardTitle>
              </div>
              <CardDescription>
                For more accurate guidance and to unlock medicine recommendations, please provide the following:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {confirmationGate.requiredInputs.map((inputType) => {
                const inputInfo = inputTypeLabels[inputType] || { 
                  label: inputType.replace("_", " "), 
                  description: "Required for accurate diagnosis",
                  icon: Camera 
                };
                const IconComponent = inputInfo.icon;
                const isUploaded = uploadedInputs[inputType];

                return (
                  <div key={inputType} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${isUploaded ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
                      {isUploaded ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{inputInfo.label}</p>
                      <p className="text-xs text-muted-foreground">{inputInfo.description}</p>
                    </div>
                    {inputType === "doctor_consultation" ? (
                      <Button
                        variant={isUploaded ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleFileUpload(inputType)}
                        disabled={isUploaded}
                        data-testid={`button-schedule-${inputType}`}
                      >
                        {isUploaded ? "Scheduled" : "Schedule"}
                      </Button>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={el => fileInputRefs.current[inputType] = el}
                          onChange={() => handleFileUpload(inputType)}
                          data-testid={`input-file-${inputType}`}
                        />
                        <Button
                          variant={isUploaded ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => fileInputRefs.current[inputType]?.click()}
                          disabled={isUploaded}
                          data-testid={`button-upload-${inputType}`}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploaded ? "Uploaded" : "Upload"}
                        </Button>
                      </>
                    )}
                  </div>
                );
              })}

              {allRequiredInputsProvided && (
                <Button
                  className="w-full"
                  onClick={handleSubmitAdvancedInputs}
                  disabled={isSubmittingInputs}
                  data-testid="button-submit-advanced-inputs"
                >
                  {isSubmittingInputs ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit for Enhanced Analysis
                    </>
                  )}
                </Button>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Medicine recommendations will be enabled after verification is complete.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Section 7.2: Preventive Guidance (NOT prescriptions) */}
        {preventiveGuidance && (
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-serif font-bold flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Base Preventive Guidance
            </h2>

            {/* Habits */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Lifestyle Habits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preventiveGuidance.habits.map((habit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Food Preferences */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Food Preferences
                </CardTitle>
                <CardDescription className="text-xs">
                  Dietary suggestions based on your constitution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preventiveGuidance.foodPreferences.map((food, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps Options */}
        {nextStepsOptions && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-serif font-bold">Recommended Paths</h2>

            <Button
              className="w-full h-auto py-4 justify-start gap-4"
              variant="default"
              onClick={() => navigate("/")}
              data-testid="button-lifestyle-only"
            >
              <Leaf className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <span className="font-medium block">Lifestyle & Prevention</span>
                <span className="text-xs opacity-80">
                  Continue with personalized wellness guidance
                </span>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto shrink-0" />
            </Button>

            <Button
              className="w-full h-auto py-4 justify-start gap-4"
              variant="outline"
              disabled={!nextStepsOptions.medicinesEnabled}
              onClick={() => nextStepsOptions.medicinesEnabled && navigate("/medicines")}
              data-testid="button-get-medicines"
            >
              <Stethoscope className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <span className="font-medium block">Get Medicines</span>
                <span className="text-xs opacity-70">
                  {nextStepsOptions.medicinesEnabled
                    ? "Doctor-verified recommendations only"
                    : nextStepsOptions.medicinesDisabledReason || "Requires additional verification"}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto shrink-0" />
            </Button>
          </div>
        )}

        {/* Section 11: Feedback Loop */}
        {!feedbackSubmitted && (
          <Card className="mb-8">
            <CardContent className="py-4 text-center">
              <p className="text-sm font-medium mb-3">Was this report helpful?</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => feedbackMutation.mutate(true)}
                  disabled={feedbackMutation.isPending}
                  data-testid="button-feedback-yes"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Yes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => feedbackMutation.mutate(false)}
                  disabled={feedbackMutation.isPending}
                  data-testid="button-feedback-no"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center pb-12">
          <Link href="/">
            <Button variant="ghost" data-testid="button-back-home">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
