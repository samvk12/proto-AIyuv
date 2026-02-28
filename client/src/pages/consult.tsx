import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, PhoneCall, MapPin, Globe, Stethoscope } from "lucide-react";

// ========================
// SECTION 9: DOCTOR CONFIRMATION FLOW (STUB)
// Reference: Spec Section 9 - Doctor Flow
// ========================

export default function ConsultDoctor() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/results">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </Link>

        <div className="text-center">
          <Stethoscope className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">
            Consult a Doctor
          </h1>
          <p className="text-muted-foreground">
            Choose the consultation mode that feels most comfortable for you.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-50">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base">In-Person Consultation</CardTitle>
                <CardDescription>Visit a nearby Ayurvedic clinic.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Select In-Person</Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-sky-50">
                <Globe className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <CardTitle className="text-base">Online Consultation</CardTitle>
                <CardDescription>Secure web-based appointment.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Select Online
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <PhoneCall className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Tele-Consultation</CardTitle>
                <CardDescription>Phone-based consultation with a doctor.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Select Tele-Consultation
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-violet-50">
                <MessageCircle className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base">Chat Consultation</CardTitle>
                <CardDescription>Text-based guidance from a practitioner.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Select Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
