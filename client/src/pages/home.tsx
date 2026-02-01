import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, UserCheck, Shield, Leaf, Activity } from "lucide-react";

// ========================
// SECTION 1: LANDING PAGE
// Reference: Spec Section 1
// ========================

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="w-10 h-10 text-primary" />
            <span className="font-serif text-3xl font-bold">AIyuv</span>
          </div>

          {/* Headline - Spec Section 1 */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            Understand your health early —
            <br />
            <span className="text-primary">prevent before it becomes disease.</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Combining ancient Ayurvedic wisdom with modern AI to provide early health insights
            and personalized preventive guidance.
          </p>

          {/* CTA Buttons - Spec Section 1 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/health-check">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2"
                data-testid="button-self-health-check"
              >
                <Heart className="w-5 h-5" />
                Self Health Check
              </Button>
            </Link>

            <Link href="/body-type">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2"
                data-testid="button-learn-body-type"
              >
                <BookOpen className="w-5 h-5" />
                Learn About Your Body Type
              </Button>
            </Link>

            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto gap-2"
              disabled
              data-testid="button-consult-practitioner"
            >
              <UserCheck className="w-5 h-5" />
              Consult Practitioner
              <span className="text-xs">(Coming Soon)</span>
            </Button>
          </div>

          {/* No login required notice */}
          <p className="text-sm text-muted-foreground mt-6">
            No login required to get started
          </p>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-8 px-6 bg-muted/30 border-y">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Safety-First Approach</h3>
              <p className="text-sm text-muted-foreground">
                This platform provides preventive wellness guidance, not medical diagnoses.
                All medicine recommendations require doctor verification. Your health and safety
                are our top priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-serif font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-elevate" data-testid="card-step-1">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-lg">Share Your Context</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Tell us about your lifestyle, sleep patterns, stress levels, and health goals
                  through a simple questionnaire.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-step-2">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-lg">Describe Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Select from a comprehensive symptom checklist or describe what you're
                  experiencing in your own words.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-step-3">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-lg">Get Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Receive personalized preventive guidance based on Ayurvedic principles
                  and AI-powered health analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-serif font-bold text-center mb-12">
            What You'll Discover
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Activity className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Dosha Balance Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Understand your unique mind-body constitution (Vata, Pitta, Kapha)
                  and identify current imbalances.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Leaf className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Lifestyle Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized daily habits, sleep routines, and stress management
                  techniques tailored to your constitution.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Food Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Discover which foods support your balance and which to avoid,
                  based on Ayurvedic dietary principles.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Safety Guardrails</h3>
                <p className="text-sm text-muted-foreground">
                  Our system identifies when professional consultation is recommended
                  and never auto-prescribes medicines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-8 px-6 border-t">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xs text-muted-foreground">
            This platform provides educational and preventive wellness information only.
            It is not a substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or qualified health provider with any
            questions you may have regarding a medical condition.
          </p>
        </div>
      </footer>
    </div>
  );
}
