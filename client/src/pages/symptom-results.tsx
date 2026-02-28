import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSymptomFlow } from "@/context/SymptomFlowContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Activity,
  HeartPulse,
  ShoppingCart,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { upsertUserSession } from "@/lib/userSessions";
import { symptomDefinitions } from "@/lib/symptom-flow";
import FlowStepper from "@/components/flow-stepper";

const mildMedicines = [
  {
    id: 1,
    name: "Triphala Churna",
    description: "Supports gentle detoxification and regular bowel movements.",
    price: "₹499",
  },
  {
    id: 2,
    name: "Ashwagandha Capsules",
    description: "Helps with stress, sleep quality, and resilience.",
    price: "₹699",
  },
  {
    id: 3,
    name: "Guduchi (Giloy) Tablets",
    description: "Traditionally used to support immunity and Pitta balance.",
    price: "₹549",
  },
];

type UploadType = "tongue" | "eyes" | "face";

export default function SymptomResults() {
  const [, navigate] = useLocation();
  const { analysis, isDoctorVerified, setDoctorVerified, selection, answers, intake, username } = useSymptomFlow();
  const [selectedUploadType, setSelectedUploadType] = useState<UploadType>("tongue");
  const [hasUploaded, setHasUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!username) {
    navigate("/patient");
    return null;
  }

  if (!analysis) {
    navigate("/symptoms");
    return null;
  }

  const { doshaBalance, overallSeverity } = analysis;

  const selectedSymptomLabels = useMemo(() => {
    const set = new Set(selection.selectedSymptomIds);
    return symptomDefinitions.filter((s) => set.has(s.id)).map((s) => ({
      id: s.id,
      label: s.label,
      dosha: s.dosha,
    }));
  }, [selection.selectedSymptomIds]);

  const inputPayload = useMemo(
    () => ({
      intake,
      selectedSymptoms: selectedSymptomLabels,
      answers,
      capturedAt: new Date().toISOString(),
    }),
    [answers, intake, selectedSymptomLabels],
  );

  const outputPayload = useMemo(
    () => ({
      severity: overallSeverity,
      doshaBalance,
      verificationRequired: overallSeverity !== "Mild",
      doctorVerified: isDoctorVerified,
      recommendations: mildMedicines,
      generatedAt: new Date().toISOString(),
    }),
    [doshaBalance, isDoctorVerified, overallSeverity],
  );

  useEffect(() => {
    // Save latest input/output snapshot for this username.
    upsertUserSession({
      username,
      last_seen_at: new Date().toISOString(),
      latest_input: inputPayload,
      latest_output: outputPayload,
      latest_severity: overallSeverity,
      latest_vata: doshaBalance.vata,
      latest_pitta: doshaBalance.pitta,
      latest_kapha: doshaBalance.kapha,
      latest_sent_to_doctor: overallSeverity !== "Mild" ? hasUploaded : false,
      latest_doctor_verified: isDoctorVerified,
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = () => {
    setHasUploaded(true);
  };

  const isMild = overallSeverity === "Mild";

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/assessment")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Assessment
      </Button>

      <FlowStepper
        steps={["Intake", "Symptoms", "Assessment", "Results"]}
        currentStep={3}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 text-[11px]">
          Step 4 of 4 • Results
        </Badge>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
          Your Ayurvedic Analysis
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          These results reflect your current imbalance pattern based on the symptoms and
          severity you shared.
        </p>
        <div className="mt-5 flex justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate("/consult")}
            data-testid="button-consult-doctor"
          >
            <Stethoscope className="w-4 h-4" />
            Consult a Doctor
          </Button>
        </div>
      </div>

      {/* Dosha Balance */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-primary" />
            Dosha Balance Snapshot
          </CardTitle>
          <CardDescription className="text-xs">
            Higher percentage indicates stronger current imbalance for that dosha.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DoshaBar label="Vata" value={doshaBalance.vata} tone="vata" />
          <DoshaBar label="Pitta" value={doshaBalance.pitta} tone="pitta" />
          <DoshaBar label="Kapha" value={doshaBalance.kapha} tone="kapha" />
        </CardContent>
      </Card>

      {/* Severity Summary */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <HeartPulse className="w-4 h-4 text-primary" />
            Diagnostic Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert
            className={
              overallSeverity === "Mild"
                ? "bg-emerald-50 border-emerald-200"
                : overallSeverity === "Moderate"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200"
            }
          >
            <AlertTitle className="flex items-center gap-2">
              <Badge
                className="px-3 py-0.5 text-xs border-none"
                variant={overallSeverity === "Mild" ? "default" : "outline"}
              >
                {overallSeverity} condition
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {overallSeverity === "Mild" &&
                "Your symptoms currently appear in a manageable range. Ayurveda often supports these with gentle herbs and lifestyle changes."}
              {overallSeverity === "Moderate" &&
                "Your symptoms are noticeable and recurring. For safety, we recommend a doctor review before any strong medicines are started."}
              {overallSeverity === "High" &&
                "Your symptoms are in a higher severity range. A qualified practitioner should verify the case before medicines are dispensed."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Conditional actions */}
      {isMild ? (
        <MildActions />
      ) : (
        <ModerateHighActions
          selectedUploadType={selectedUploadType}
          setSelectedUploadType={setSelectedUploadType}
          fileInputRef={fileInputRef}
          onUploadClick={handleUploadClick}
          onFileChange={handleFileChange}
          hasUploaded={hasUploaded}
          isDoctorVerified={isDoctorVerified}
          onSimulateVerify={() => setDoctorVerified(true)}
        />
      )}
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
  const barClass =
    tone === "vata" ? "dosha-bar-vata" : tone === "pitta" ? "dosha-bar-pitta" : "dosha-bar-kapha";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-accent/60 overflow-hidden">
        <div
          className={`dosha-bar ${barClass}`}
          style={{ width: `${value}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function MildActions() {
  return (
    <div className="space-y-5">
      <Alert className="bg-emerald-50 border-emerald-200">
        <AlertTitle className="font-semibold text-emerald-800">
          Support with gentle Ayurvedic herbs
        </AlertTitle>
        <AlertDescription className="text-sm text-emerald-800/90">
          Based on your symptom profile, these over-the-counter formulations are usually
          considered safe when used as directed. Always follow package instructions and
          consult a practitioner if symptoms persist.
        </AlertDescription>
      </Alert>

      <div className="grid sm:grid-cols-3 gap-4">
        {mildMedicines.map((med) => (
          <Card key={med.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{med.name}</CardTitle>
              <CardDescription className="text-xs">{med.price}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{med.description}</p>
              <Button size="sm" className="mt-1 gap-1.5">
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground text-center italic">
        These recommendations are for educational purposes and do not replace a
        personalized consultation.
      </p>
    </div>
  );
}

interface ModerateHighActionsProps {
  selectedUploadType: UploadType;
  setSelectedUploadType: (t: UploadType) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onUploadClick: () => void;
  onFileChange: () => void;
  hasUploaded: boolean;
  isDoctorVerified: boolean;
  onSimulateVerify: () => void;
}

function ModerateHighActions({
  selectedUploadType,
  setSelectedUploadType,
  fileInputRef,
  onUploadClick,
  onFileChange,
  hasUploaded,
  isDoctorVerified,
  onSimulateVerify,
}: ModerateHighActionsProps) {
  const uploadLabel =
    selectedUploadType === "tongue"
      ? "Tongue photo"
      : selectedUploadType === "eyes"
        ? "Eyes photo"
        : "Face photo";

  return (
    <div className="space-y-6">
      <Card className="border-amber-300 bg-amber-50/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Verification Required Before Medicines
          </CardTitle>
          <CardDescription className="text-xs">
            For your safety, a qualified Ayurvedic practitioner must review visual signs
            like tongue, eyes, or facial complexion before stronger medicines are enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedUploadType === "tongue" ? "default" : "outline"}
              onClick={() => setSelectedUploadType("tongue")}
            >
              Tongue
            </Button>
            <Button
              size="sm"
              variant={selectedUploadType === "eyes" ? "default" : "outline"}
              onClick={() => setSelectedUploadType("eyes")}
            >
              Eyes
            </Button>
            <Button
              size="sm"
              variant={selectedUploadType === "face" ? "default" : "outline"}
              onClick={() => setSelectedUploadType("face")}
            >
              Face
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <Button
              className="flex-1 gap-2"
              variant="outline"
              onClick={onUploadClick}
              data-testid="button-upload-image"
            >
              <Camera className="w-4 h-4" />
              Upload {uploadLabel}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            {hasUploaded && (
              <span className="flex items-center gap-1 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Image attached
              </span>
            )}
          </div>

          <Button
            disabled={!hasUploaded}
            className="w-full gap-2"
            data-testid="button-submit-to-doctor"
          >
            <ImageIcon className="w-4 h-4" />
            Submit to Doctor for Review
          </Button>

          <p className="text-[11px] text-muted-foreground">
            A practitioner will review your case and images, confirm dosage and safety,
            and then approve any medicines if appropriate.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Medicine Access</CardTitle>
          <CardDescription className="text-xs">
            For this prototype, you can simulate doctor approval to preview the
            experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Status:{" "}
              <span className="font-medium text-foreground">
                {isDoctorVerified ? "Doctor Verified" : "Awaiting Verification"}
              </span>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onSimulateVerify}
              disabled={isDoctorVerified}
            >
              Mark as Verified (Demo)
            </Button>
          </div>

          {!isDoctorVerified ? (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Buy Medicines is locked until a doctor has reviewed and approved your case.
              </p>
              <Button size="sm" className="gap-1.5" disabled>
                <ShoppingCart className="w-4 h-4" />
                Buy Medicines (Pending Doctor Verification)
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Verification completed. You can now preview the same over-the-counter
                herb recommendations shown for mild cases.
              </p>
              <MildActions />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

