import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Shield
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
  kapha: "bg-green-500",
};

const doshaTextColors = {
  vata: "text-blue-600 dark:text-blue-400",
  pitta: "text-red-600 dark:text-red-400",
  kapha: "text-green-600 dark:text-green-400",
};

const riskBadgeColors = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function HealthCheckResults() {
  const [, navigate] = useLocation();
  const [caseData, setCaseData] = useState<HealthCheckCase | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

  if (!caseData) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p>Loading results...</p>
      </div>
    );
  }

  const { healthSnapshot, preventiveGuidance, diagnosisResult, nextStepsOptions, confirmationGate, medicalAwareness } = caseData;
  const ayurvedic = diagnosisResult?.ayurvedicAssessment;
  const medical = diagnosisResult?.medicalAssessment;

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-bold mb-2">Your Health Insights</h1>
        <p className="text-muted-foreground">
          Based on Ayurvedic analysis and AI screening
        </p>
      </div>

      {/* Section 7.1: Health Snapshot */}
      {healthSnapshot && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <CardTitle>Health Snapshot</CardTitle>
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

      {/* Section 4: Confirmation Gate Warning */}
      {confirmationGate?.triggered && !confirmationGate.inputsProvided && (
        <Alert className="mb-6 border-yellow-500">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Additional Verification Needed</AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              For more accurate guidance, the following inputs are recommended:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {confirmationGate.requiredInputs.map((input) => (
                <li key={input} className="capitalize">
                  {input.replace("_", " ")}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Until these are provided, medicine recommendations are not available.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Section 7.2: Preventive Guidance (NOT prescriptions) */}
      {preventiveGuidance && (
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-serif font-bold flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Preventive Guidance
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

          {/* Food Preferences (NOT prescriptions) */}
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

          {/* Sleep & Stress Tips */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Sleep Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preventiveGuidance.sleepTips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Stress Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preventiveGuidance.stressTips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Section 7.3: Medical Awareness */}
      {medicalAwareness && (
        <Card className="mb-6 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Medical Awareness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medical?.redFlags && medical.redFlags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 text-yellow-600">Important Notes:</p>
                <ul className="space-y-1">
                  {medical.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-2">When to Seek Help:</p>
              <ul className="space-y-1">
                {medicalAwareness.whenToSeekHelp.slice(0, 3).map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer - Required by Spec Section 7 */}
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription className="text-sm">
          This is not a medical diagnosis. The information provided is for educational
          and preventive wellness purposes only. Always consult a qualified healthcare
          professional for medical advice, diagnosis, or treatment.
        </AlertDescription>
      </Alert>

      {/* Section 8: Next Steps Options */}
      {nextStepsOptions && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-serif font-bold">Next Steps</h2>

          {/* A. Lifestyle & Prevention (always enabled) */}
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

          {/* B. Get Medicines (conditionally enabled) */}
          <Button
            className="w-full h-auto py-4 justify-start gap-4"
            variant="outline"
            disabled={!nextStepsOptions.medicinesEnabled}
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

          {/* C. Consult Doctor First */}
          <Button
            className="w-full h-auto py-4 justify-start gap-4"
            variant="outline"
            disabled={!nextStepsOptions.consultDoctorEnabled}
            data-testid="button-consult-doctor"
          >
            <MessageCircle className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <span className="font-medium block">Consult Doctor First</span>
              <span className="text-xs opacity-70">
                Speak with a healthcare practitioner
              </span>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto shrink-0" />
          </Button>
        </div>
      )}

      {/* Section 11: Feedback Loop */}
      {!feedbackSubmitted && (
        <Card className="mb-8">
          <CardContent className="py-4">
            <p className="text-sm font-medium mb-3 text-center">Was this helpful?</p>
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

      {feedbackSubmitted && (
        <Card className="mb-8 bg-green-50 dark:bg-green-900/20">
          <CardContent className="py-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm">Thank you for your feedback!</p>
          </CardContent>
        </Card>
      )}

      {/* Back to Home */}
      <div className="text-center">
        <Link href="/">
          <Button variant="ghost" data-testid="button-back-home">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
