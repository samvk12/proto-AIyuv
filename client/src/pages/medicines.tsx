import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Pill, Shield, AlertTriangle, Clock, CheckCircle2, UserCheck, Package } from "lucide-react";
import type { HealthCheckCase } from "@shared/schema";

// ========================
// SECTION 10: MEDICINE FULFILLMENT (STUB)
// Reference: Spec Section 10 - Medicine Fulfillment
// ========================

export default function Medicines() {
  const [, navigate] = useLocation();
  const [caseData, setCaseData] = useState<HealthCheckCase | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("healthCheckCase");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setCaseData(data);
        
        // Redirect if medicines are not enabled
        if (!data.nextStepsOptions?.medicinesEnabled) {
          navigate("/health-check/results");
        }
      } catch (e) {
        navigate("/health-check/results");
      }
    } else {
      navigate("/health-check/results");
    }
  }, [navigate]);

  if (!caseData || !caseData.nextStepsOptions?.medicinesEnabled) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/health-check/results">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </Link>

        <div className="text-center">
          <Pill className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">
            Medicine Recommendations
          </h1>
          <p className="text-muted-foreground">
            Doctor-verified Ayurvedic formulations
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <Alert className="mb-6 border-green-500">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Verification Complete</AlertTitle>
        <AlertDescription className="text-sm">
          Your advanced inputs have been reviewed. You now have access to medicine recommendations.
        </AlertDescription>
      </Alert>

      {/* Coming Soon Notice */}
      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="py-6 text-center">
          <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
          <h2 className="font-semibold mb-2">Medicine Fulfillment Under Development</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're building a secure platform to provide doctor-verified Ayurvedic medicines.
            This feature requires additional practitioner review before recommendations can be made.
          </p>
        </CardContent>
      </Card>

      {/* How It Will Work */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-serif font-bold">How It Works</h2>

        <Card>
          <CardContent className="py-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">AI Analysis Complete</p>
                  <p className="text-xs text-muted-foreground">Your health profile has been analyzed</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0" />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Doctor Review</p>
                  <p className="text-xs text-muted-foreground">A practitioner reviews recommendations</p>
                </div>
                <Clock className="w-5 h-5 text-yellow-500 ml-auto shrink-0" />
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Medicine Dispensing</p>
                  <p className="text-xs text-muted-foreground">Verified formulations prepared for you</p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Delivery</p>
                  <p className="text-xs text-muted-foreground">Safe delivery to your doorstep</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Safety Guarantees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <UserCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Every prescription reviewed by qualified practitioners</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Package className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Authentic, quality-tested Ayurvedic formulations</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Shield className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>No auto-prescription - human verification required</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription className="text-sm">
          Medicine recommendations are based on your health profile and require practitioner verification.
          Always inform your doctor about any supplements or medicines you're considering.
        </AlertDescription>
      </Alert>

      {/* Notify Me */}
      <div className="text-center">
        <Button disabled className="mb-4" data-testid="button-notify-me">
          Notify Me When Available
        </Button>
        <p className="text-xs text-muted-foreground">
          We'll let you know when medicine fulfillment is ready
        </p>
      </div>
    </div>
  );
}
