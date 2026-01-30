import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  User,
  Stethoscope,
  FileText,
  Camera
} from "lucide-react";
import type { HealthCheckCase, DiagnosisResult, PreventiveGuidance } from "@shared/schema";

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

const riskColors = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function HealthCheckResults() {
  const [, navigate] = useLocation();
  const [caseData, setCaseData] = useState<HealthCheckCase | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("healthCheckCase");
    if (stored) {
      setCaseData(JSON.parse(stored));
    } else {
      navigate("/health-check");
    }
  }, [navigate]);

  if (!caseData || !caseData.diagnosisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { diagnosisResult, preventiveGuidance, userContext } = caseData;
  const { ayurvedicAssessment, possibleConditions, confidence, riskLevel, requiresAdvancedInputs, requiredInputTypes, redFlags } = diagnosisResult;

  const renderHealthSnapshot = () => (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Health Snapshot
            </CardTitle>
            <CardDescription>Your personalized health overview</CardDescription>
          </div>
          <Badge className={riskColors[riskLevel]} data-testid="badge-risk-level">
            {riskLevel === "low" ? "Low Risk" : riskLevel === "medium" ? "Moderate Risk" : "Elevated Risk"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <div className={`text-2xl font-bold ${doshaTextColors[ayurvedicAssessment.prakriti]}`}>
              {ayurvedicAssessment.prakriti.charAt(0).toUpperCase() + ayurvedicAssessment.prakriti.slice(1)}
            </div>
            <div className="text-sm text-muted-foreground">Constitution (Prakriti)</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <div className={`text-2xl font-bold ${doshaTextColors[ayurvedicAssessment.vikriti]}`}>
              {ayurvedicAssessment.vikriti.charAt(0).toUpperCase() + ayurvedicAssessment.vikriti.slice(1)}
            </div>
            <div className="text-sm text-muted-foreground">Current Imbalance (Vikriti)</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Dosha Balance</div>
          {(["vata", "pitta", "kapha"] as const).map(dosha => (
            <div key={dosha} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{dosha}</span>
                <span>{ayurvedicAssessment.doshaBalance[dosha]}%</span>
              </div>
              <Progress 
                value={ayurvedicAssessment.doshaBalance[dosha]} 
                className={`h-2 ${doshaColors[dosha]}`}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span className="text-sm">Analysis Confidence</span>
          <div className="flex items-center gap-2">
            <Progress value={confidence} className="w-20 h-2" />
            <span className="text-sm font-medium">{confidence}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderConditions = () => (
    possibleConditions.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-5 h-5 text-primary" />
            Health Observations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {possibleConditions.map((condition, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium">{condition.name}</div>
                <div className="text-sm text-muted-foreground">{condition.category}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{condition.confidence}% match</div>
                {condition.relatedDosha && (
                  <Badge variant="outline" className="text-xs">
                    {condition.relatedDosha}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  );

  const renderAdvancedInputsNeeded = () => (
    requiresAdvancedInputs && (
      <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-yellow-700 dark:text-yellow-400">
            <Camera className="w-5 h-5" />
            Additional Information Needed
          </CardTitle>
          <CardDescription>
            To provide more accurate insights, we recommend submitting the following:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {requiredInputTypes.map((type, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium capitalize">{type.replace("_", " ")} {type !== "doctor_consultation" ? "Image" : ""}</div>
                  <div className="text-sm text-muted-foreground">
                    {type === "skin" && "Clear photo of affected skin area"}
                    {type === "tongue" && "Photo of your tongue in natural light"}
                    {type === "face" && "Front-facing photo of your face"}
                    {type === "doctor_consultation" && "Speak with a healthcare provider"}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Upload
              </Button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2">
            Note: Medicine recommendations require these additional inputs for safety.
          </p>
        </CardContent>
      </Card>
    )
  );

  const renderRedFlags = () => (
    redFlags.length > 0 && (
      <Card className="border-red-500/50 bg-red-50/50 dark:bg-red-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Important Notices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  );

  const renderPreventiveGuidance = () => (
    preventiveGuidance && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Leaf className="w-5 h-5 text-primary" />
            Preventive Guidance
          </CardTitle>
          <CardDescription>Personalized recommendations for your wellness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {preventiveGuidance.habits.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Activity className="w-4 h-4 text-primary" />
                Daily Habits
              </div>
              <ul className="space-y-1 ml-6">
                {preventiveGuidance.habits.map((habit, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {habit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preventiveGuidance.foodPreferences.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Utensils className="w-4 h-4 text-primary" />
                Food Preferences
              </div>
              <ul className="space-y-1 ml-6">
                {preventiveGuidance.foodPreferences.map((food, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {food}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preventiveGuidance.sleepTips.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Moon className="w-4 h-4 text-primary" />
                Sleep Tips
              </div>
              <ul className="space-y-1 ml-6">
                {preventiveGuidance.sleepTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preventiveGuidance.stressTips.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Brain className="w-4 h-4 text-primary" />
                Stress Management
              </div>
              <ul className="space-y-1 ml-6">
                {preventiveGuidance.stressTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preventiveGuidance.warnings.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                Things to Avoid
              </div>
              <ul className="space-y-1 ml-6">
                {preventiveGuidance.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  );

  const renderNextSteps = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">What Would You Like to Do?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full justify-between" 
          variant="outline"
          onClick={() => navigate("/")}
          data-testid="button-lifestyle-only"
        >
          <span className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Continue with Lifestyle & Prevention
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button 
          className="w-full justify-between" 
          variant="outline"
          disabled={requiresAdvancedInputs}
          data-testid="button-get-medicines"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Get Medicine Recommendations
            {requiresAdvancedInputs && <Badge variant="secondary" className="ml-2 text-xs">Requires Additional Input</Badge>}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button 
          className="w-full justify-between" 
          variant="outline"
          data-testid="button-consult-doctor"
        >
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Consult a Practitioner
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-serif font-bold">Your Health Analysis</h1>
          <p className="text-muted-foreground">Based on your responses and Ayurvedic principles</p>
        </div>

        {renderHealthSnapshot()}
        {renderRedFlags()}
        {renderAdvancedInputsNeeded()}
        {renderConditions()}
        {renderPreventiveGuidance()}

        <Separator />

        {renderNextSteps()}

        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This is not a medical diagnosis. The information provided is for educational purposes and based on Ayurvedic wellness principles. Always consult a qualified healthcare provider for medical advice, diagnosis, or treatment.
          </p>
        </div>

        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate("/")}
          data-testid="button-go-home"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
