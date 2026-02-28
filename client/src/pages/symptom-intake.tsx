import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSymptomFlow } from "@/context/SymptomFlowContext";
import { ArrowRight, ArrowLeft, MapPin, User } from "lucide-react";
import FlowStepper from "@/components/flow-stepper";

const ageOptions = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"] as const;

export default function SymptomIntake() {
  const [, navigate] = useLocation();
  const { intake, setIntake, username } = useSymptomFlow();

  if (!username) {
    navigate("/patient");
    return null;
  }

  const canContinue = Boolean(intake.ageRange && intake.region.trim().length > 0);

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
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
        currentStep={0}
        className="mb-5"
      />

      <Card>
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit text-[11px]">
            Step 1 of 4 • Intake
          </Badge>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Tell us a bit about you
          </CardTitle>
          <CardDescription>
            Your age range and region help us interpret symptoms more accurately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Age Range</p>
            <div className="flex flex-wrap gap-2">
              {ageOptions.map((age) => (
                <Button
                  key={age}
                  variant={intake.ageRange === age ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIntake({ ...intake, ageRange: age })}
                >
                  {age}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Current Location / Region
            </p>
            <Input
              placeholder="e.g. Mumbai – India, or California – USA"
              value={intake.region}
              onChange={(e) => setIntake({ ...intake, region: e.target.value })}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              This does not need to be your full address – just the city / state / country.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              className="gap-2"
              disabled={!canContinue}
              onClick={() => navigate("/symptoms")}
            >
              Continue to Symptoms
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

