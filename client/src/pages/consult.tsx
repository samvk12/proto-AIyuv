import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Video, Calendar, Clock, UserCheck, Shield } from "lucide-react";

// ========================
// SECTION 9: DOCTOR CONFIRMATION FLOW (STUB)
// Reference: Spec Section 9 - Doctor Flow
// ========================

export default function ConsultDoctor() {
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
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">
            Consult with a Practitioner
          </h1>
          <p className="text-muted-foreground">
            Connect with verified Ayurvedic practitioners and healthcare professionals
          </p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="py-6 text-center">
          <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
          <h2 className="font-semibold mb-2">This Feature is Under Development</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're building a secure platform to connect you with verified practitioners.
            In the meantime, we recommend consulting with your local healthcare provider.
          </p>
        </CardContent>
      </Card>

      {/* Consultation Types Preview */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-serif font-bold">Consultation Options</h2>

        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Video Consultation</CardTitle>
                <CardDescription>Face-to-face virtual appointment</CardDescription>
              </div>
              <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Chat Consultation</CardTitle>
                <CardDescription>Text-based consultation with a practitioner</CardDescription>
              </div>
              <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Schedule Appointment</CardTitle>
                <CardDescription>Book an in-person visit</CardDescription>
              </div>
              <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Safety Features Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Safety & Quality Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <UserCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>All practitioners are verified and credentialed</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Shield className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Secure, encrypted communication</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Clock className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Flexible scheduling with reminders</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Notify Me */}
      <div className="text-center">
        <Button disabled className="mb-4" data-testid="button-notify-me">
          Notify Me When Available
        </Button>
        <p className="text-xs text-muted-foreground">
          We'll let you know when practitioner consultations are available
        </p>
      </div>
    </div>
  );
}
