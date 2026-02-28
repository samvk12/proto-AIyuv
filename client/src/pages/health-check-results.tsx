import { useEffect, useState, useRef, useMemo } from "react";
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
  Target,
  ArrowLeft,
  ArrowRight,
  Flame,
  Wind,
  ShoppingCart,
  Lock
} from "lucide-react";
import type { HealthCheckCase } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { symptoms, symptomSpecificQuestions, getSymptomById } from "@shared/symptoms-data";

// ========================
// SECTION 7 & 8: OUTPUT TO USER + NEXT STEPS
// Reference: Spec Sections 7 and 8
// ========================

const doshaColors = {
  vata: "bg-blue-500",
  pitta: "bg-red-500",
  kapha: "bg-primary",
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

const medicineRecommendations = [
  { id: 1, name: "Triphala Churna", type: "Herbal", price: "$15.00", description: "Digestive support and detox." },
  { id: 2, name: "Brahmi Vati", type: "Herbal", price: "$22.00", description: "Memory and stress management." },
  { id: 3, name: "Ashwagandha", type: "Herbal", price: "$18.00", description: "Strength and vitality booster." }
];

export default function HealthCheckResults() {
  const [, navigate] = useLocation();
  const [caseData, setCaseData] = useState<HealthCheckCase | null>(null);
  const [uploadedInputs, setUploadedInputs] = useState<Record<string, boolean>>({});
  const [goalStatus, setGoalStatus] = useState<"yes" | "no" | null>(null);
  const [activeSection, setActiveSection] = useState<"dashboard" | "diagnosis" | "prevention">("dashboard");
  const [diagnosisStep, setDiagnosisStep] = useState<"symptom" | "intensity" | "questions" | "verification" | "analysis">("symptom");
  const [selectedDiagnosisSymptom, setSelectedDiagnosisSymptom] = useState<number | null>(null);
  const [intensityValue, setIntensityValue] = useState<number>(5);
  const [specificAnswers, setSpecificAnswers] = useState<Record<string, number>>({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  
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

  const selectedSymptomData = useMemo(() => 
    selectedDiagnosisSymptom ? getSymptomById(selectedDiagnosisSymptom) : null
  , [selectedDiagnosisSymptom]);

  const currentSymptomQuestions = useMemo(() => 
    selectedSymptomData ? symptomSpecificQuestions[selectedSymptomData.category] || [] : []
  , [selectedSymptomData]);

  const severityScore = useMemo(() => {
    let score = Math.ceil(intensityValue / 2); // 1-10 intensity -> 1-5 score
    Object.values(specificAnswers).forEach(s => score += s);
    return score;
  }, [intensityValue, specificAnswers]);

  const severityLevel = useMemo(() => {
    if (severityScore <= 3) return "Mild";
    if (severityScore <= 6) return "Moderate";
    return "High";
  }, [severityScore]);

  const severityColor = useMemo(() => {
    if (severityLevel === "Mild") return "text-green-600 bg-green-50 border-green-200";
    if (severityLevel === "Moderate") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  }, [severityLevel]);

  const doctorVerified = useMemo(
    () =>
      caseData?.status === "doctor_approved" ||
      caseData?.nextStepsOptions?.medicinesEnabled === true ||
      caseData?.confirmationGate?.canEnableMedicines === true,
    [caseData],
  );

  const handleFileUpload = (inputType: string) => {
    setUploadedInputs(prev => ({ ...prev, [inputType]: true }));
  };

  if (!caseData) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p>Loading results...</p>
      </div>
    );
  }

  const { healthSnapshot, preventiveGuidance, confirmationGate } = caseData;

  const dashboardMain = (
    <div className="animate-in fade-in duration-500">
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

      {healthSnapshot && (
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Ayurvedic Dosha Dashboard
            </CardTitle>
            <CardDescription className="text-xs">
              Visualization of your Vata, Pitta, and Kapha balance from the latest analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <DoshaBar label="Vata" value={healthSnapshot.doshaVisualization.vata} tone="vata" />
            <DoshaBar label="Pitta" value={healthSnapshot.doshaVisualization.pitta} tone="pitta" />
            <DoshaBar label="Kapha" value={healthSnapshot.doshaVisualization.kapha} tone="kapha" />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-serif font-bold">Recommended Paths</h2>

        <Button
          className="w-full h-auto py-6 justify-start gap-4 hover-elevate transition-all"
          variant="outline"
          onClick={() => {
            setActiveSection("diagnosis");
            setDiagnosisStep("symptom");
          }}
          data-testid="button-current-discomfort"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-left">
            <span className="font-bold block text-lg">Current Discomfort</span>
            <span className="text-sm text-muted-foreground">
              Experiencing pain or unusual symptoms? Start a guided diagnostic check.
            </span>
          </div>
          <ChevronRight className="w-5 h-5 ml-auto shrink-0 text-muted-foreground" />
        </Button>

        <Button
          className="w-full h-auto py-6 justify-start gap-4 hover-elevate transition-all"
          variant="outline"
          onClick={() => setActiveSection("prevention")}
          data-testid="button-lifestyle-prevention"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <span className="font-bold block text-lg">Lifestyle & Prevention</span>
            <span className="text-sm text-muted-foreground">
              Access your personalized Ayurvedic diet, routine, and habits.
            </span>
          </div>
          <ChevronRight className="w-5 h-5 ml-auto shrink-0 text-muted-foreground" />
        </Button>
      </div>

      <div className="text-center pb-12">
        <Link href="/">
          <Button variant="ghost" data-testid="button-back-home">
            <Home className="w-4 h-4 mr-2" />
            Back to Portal Selection
          </Button>
        </Link>
      </div>
    </div>
  );

  const diagnosisContent = (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => {
          setActiveSection("dashboard");
          setDiagnosisStep("symptom");
        }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">
            {diagnosisStep === "symptom" && "Select Symptom"}
            {diagnosisStep === "intensity" && "Intensity Check"}
            {diagnosisStep === "questions" && "Detailed Assessment"}
            {diagnosisStep === "verification" && "Safety Verification"}
            {diagnosisStep === "analysis" && "Final Result"}
          </span>
          <span className="text-muted-foreground">
            Progress: {
              diagnosisStep === "symptom" ? "20%" :
              diagnosisStep === "intensity" ? "40%" :
              diagnosisStep === "questions" ? "60%" :
              diagnosisStep === "verification" ? "80%" : "100%"
            }
          </span>
        </div>
        <Progress 
          value={
            diagnosisStep === "symptom" ? 20 :
            diagnosisStep === "intensity" ? 40 :
            diagnosisStep === "questions" ? 60 :
            diagnosisStep === "verification" ? 80 : 100
          } 
          className="h-2" 
        />
      </div>

      {diagnosisStep === "symptom" && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">What's bothering you?</h2>
            <p className="text-muted-foreground">Select the primary symptom you are experiencing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 1, name: "Fatigue / Low energy", icon: Zap },
              { id: 10, name: "Heartburn / Reflux", icon: Flame },
              { id: 5, name: "Digestion Issues", icon: Utensils },
              { id: 6, name: "Joint Pain / Stiffness", icon: Activity },
              { id: 2, name: "Headache / Anxiety", icon: Brain },
              { id: 18, name: "Congestion", icon: Wind }
            ].map((sym) => (
              <Button
                key={sym.id}
                variant={selectedDiagnosisSymptom === sym.id ? "default" : "outline"}
                className="h-auto py-4 justify-start gap-3"
                onClick={() => setSelectedDiagnosisSymptom(sym.id)}
              >
                <sym.icon className={`w-5 h-5 ${selectedDiagnosisSymptom === sym.id ? "text-white" : "text-primary"}`} />
                {sym.name}
              </Button>
            ))}
          </div>
          <Button 
            className="w-full mt-8" 
            disabled={!selectedDiagnosisSymptom}
            onClick={() => setDiagnosisStep("intensity")}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {diagnosisStep === "intensity" && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">Almost there</h2>
            <p className="text-muted-foreground">Help us understand the severity of your discomfort.</p>
          </div>
          
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Rate the intensity (1-10)</label>
                  <span className="text-2xl font-bold text-primary">{intensityValue}</span>
                </div>
                <Input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={intensityValue} 
                  onChange={(e) => setIntensityValue(parseInt(e.target.value))}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => setDiagnosisStep("questions")}>
            Next: Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {diagnosisStep === "questions" && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">Specific Details</h2>
            <p className="text-muted-foreground">Help us triage your {selectedSymptomData?.category} symptoms.</p>
          </div>

          <div className="space-y-4">
            {currentSymptomQuestions.map((q) => (
              <Card key={q.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{q.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <Button
                        key={opt.label}
                        variant={specificAnswers[q.id] === opt.score ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSpecificAnswers(prev => ({ ...prev, [q.id]: opt.score }))}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            className="w-full mt-6" 
            disabled={Object.keys(specificAnswers).length < currentSymptomQuestions.length}
            onClick={() => setDiagnosisStep("verification")}
          >
            Review Safety Check
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {diagnosisStep === "verification" && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">Safety Verification</h2>
            <p className="text-muted-foreground">Upload required data for final confirmation.</p>
          </div>

          <Card className={`border-2 ${severityColor}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">Detected Severity: {severityLevel}</span>
              </div>
              <p className="text-sm opacity-90">
                {severityLevel === "Mild"
                  ? "Your symptoms appear manageable with basic Ayurvedic support."
                  : "Due to the intensity of your symptoms, we require verification data before recommending medication."}
              </p>
            </CardContent>
          </Card>

          {confirmationGate?.triggered && (
            <div className="space-y-4">
              {confirmationGate.requiredInputs.map((inputType) => {
                const inputInfo = inputTypeLabels[inputType] || { label: inputType.replace("_", " "), description: "Required", icon: Camera };
                const isUploaded = uploadedInputs[inputType];

                return (
                  <div key={inputType} className="flex items-center gap-4 p-3 border rounded-lg bg-background">
                    <div className={`p-2 rounded-full ${isUploaded ? "bg-green-100" : "bg-muted"}`}>
                      {isUploaded ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <inputInfo.icon className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{inputInfo.label}</p>
                    </div>
                    <Button
                      variant={isUploaded ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => inputType === "doctor_consultation" ? handleFileUpload(inputType) : fileInputRefs.current[inputType]?.click()}
                      disabled={isUploaded}
                    >
                      {isUploaded ? "Done" : "Upload"}
                    </Button>
                    <input type="file" className="hidden" ref={el => fileInputRefs.current[inputType] = el} onChange={() => handleFileUpload(inputType)} />
                  </div>
                );
              })}
            </div>
          )}

          <Button
            className="w-full mt-6"
            onClick={() => setDiagnosisStep("analysis")}
          >
            Finish Analysis
          </Button>
        </div>
      )}

      {diagnosisStep === "analysis" && (
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="text-center mb-8">
            <Badge className={`mb-4 px-4 py-1 border-none font-bold ${severityColor}`}>
              Result: {severityLevel} Condition
            </Badge>
            <h2 className="text-2xl font-serif font-bold">Recommended Actions</h2>
          </div>

          {severityLevel === "Mild" ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">OTC Recommendations Available</AlertTitle>
                <AlertDescription className="text-green-700">
                  You can purchase these herbal supplements directly. Please follow the dosage instructions carefully.
                </AlertDescription>
              </Alert>

              <MedicineList />
              <p className="text-xs text-center text-muted-foreground italic">
                *Disclaimer: These are over-the-counter herbal supplements. Consult a doctor if symptoms persist.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-8 rounded-xl border-2 border-dashed border-yellow-300 bg-yellow-50 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-yellow-600" />
                </div>
                <Badge variant="outline" className="mb-4 bg-white text-yellow-700 border-yellow-200">
                  {doctorVerified ? "Doctor Verified" : "Sent to Doctor for Verification"}
                </Badge>
                <h3 className="text-lg font-bold mb-2">
                  {doctorVerified ? "Medicines Unlocked" : "Purchase Restricted"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {doctorVerified
                    ? "A physician has reviewed your case. You can now access the recommended Ayurvedic medicines below."
                    : "Due to the intensity of your symptoms, a physician must review your case before medication can be dispensed. Your verification data has been queued for review."}
                </p>
              </div>

              {!doctorVerified && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      Consultation Hub
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Choose how you&apos;d like to speak with a doctor for this case.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-3 gap-3">
                    <Button variant="outline" className="flex flex-col items-start gap-1 h-auto py-3">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Online Chat</span>
                      <span className="text-[11px] text-muted-foreground">
                        Get quick clarifications in a secure chat.
                      </span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-start gap-1 h-auto py-3">
                      <Camera className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Tele-consultation</span>
                      <span className="text-[11px] text-muted-foreground">
                        Audio/video call with an Ayurvedic doctor.
                      </span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-start gap-1 h-auto py-3">
                      <Home className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">In-person Visit</span>
                      <span className="text-[11px] text-muted-foreground">
                        Find a nearby partner clinic (coming soon).
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {doctorVerified && (
                <div className="space-y-4">
                  <MedicineList />
                  <p className="text-xs text-center text-muted-foreground italic">
                    *Medicines shown here are enabled only after doctor verification.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveSection("dashboard")}
                >
                  Return to Dashboard
                </Button>
                <Button className="flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Practitioner
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const preventionContent = (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => setActiveSection("dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Lifestyle & Prevention</h2>
        <p className="text-muted-foreground">Personalized Ayurvedic guidance for long-term wellness</p>
      </div>

      <div className="space-y-6">
        {preventiveGuidance ? (
          <>
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Stress Management
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {preventiveGuidance.stressTips.map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Moon className="w-5 h-5 text-primary" />
                  Sleep Cycle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {preventiveGuidance.sleepTips.map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Exercise & Movement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {preventiveGuidance.activityTips.map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Diet & Food Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {preventiveGuidance.foodPreferences.map((food, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm leading-relaxed">{food}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground italic">No guidance found. Please complete a profile check.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl min-h-screen">
      {activeSection === "dashboard" && dashboardMain}
      {activeSection === "diagnosis" && diagnosisContent}
      {activeSection === "prevention" && preventionContent}
    </div>
  );
}

function DoshaBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "vata" | "pitta" | "kapha";
}) {
  const baseClass =
    tone === "vata" ? "dosha-bar-vata" : tone === "pitta" ? "dosha-bar-pitta" : "dosha-bar-kapha";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-accent/60 overflow-hidden">
        <div className={`dosha-bar ${baseClass}`} style={{ width: `${value}%` }} aria-hidden="true" />
      </div>
    </div>
  );
}

function MedicineList() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {medicineRecommendations.map((med) => (
        <Card key={med.id}>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <h4 className="font-bold">{med.name}</h4>
              <p className="text-sm text-muted-foreground">{med.description}</p>
              <span className="text-primary font-bold">{med.price}</span>
            </div>
            <Button className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

