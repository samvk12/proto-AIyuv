import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Leaf, Activity, ChevronRight, Sparkles, Heart } from "lucide-react";

// ========================
// SECTION 1: LANDING PAGE
// Modern UI/UX Design with Whiteish-Green Theme
// ========================

export default function Home() {
  const quotes = useMemo(
    () => [
      "When diet is wrong, medicine is of no use; when diet is correct, medicine is of no need.",
      "Balance is the perfect state of body, mind, and consciousness.",
      "The body is the temple of the mind — nourish both with care.",
      "Health is not just the absence of disease, but harmony within.",
    ],
    [],
  );
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean gradient with clear hierarchy */}
      <section className="relative py-16 md:py-24 px-6 gradient-hero">
        <div className="container mx-auto max-w-4xl">
          {/* Logo - Centered brand identity */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="font-serif text-3xl font-bold text-foreground">AIyuv</span>
          </div>

          {/* Headline - Strong, concise value proposition */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight tracking-tight text-foreground">
              Understand your health early —
              <br />
              <span className="text-primary">prevent before it becomes disease.</span>
            </h1>

            {/* Subtext - Supporting description */}
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Combining ancient Ayurvedic wisdom with modern AI to provide early health insights
              and personalized preventive guidance — all without the need for an account.
            </p>

            {/* Primary CTA - Stand out visually */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link href="/patient">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 px-8 h-12 text-base font-medium shadow-md"
                  data-testid="button-enter-portal"
                >
                  Enter Portal
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicator */}
            <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              No login required • Your privacy is protected
            </p>
          </div>
        </div>
      </section>

      {/* Daily Wisdom */}
      <section className="py-10 px-6 bg-emerald-50/60 border-y border-emerald-100">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700/70 mb-3">
            Daily Wisdom
          </p>
          <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
            “{quotes[quoteIndex]}”
          </p>
          <p className="text-xs text-emerald-700/70 mt-3">Ayurvedic Insight</p>
        </div>
      </section>

      {/* Safety Notice - Clear visual distinction */}
      <section className="py-6 px-6 bg-accent/50 border-y border-border">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Safety-First Approach</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This platform provides preventive wellness guidance, not medical diagnoses.
                All medicine recommendations require doctor verification. Your health and safety
                are our top priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Clear 3-step process */}
      <section className="py-16 md:py-20 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to personalized health insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {/* Step 1 */}
            <Card className="hover-elevate border-border/50" data-testid="card-step-1">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Share Your Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Tell us about your lifestyle, sleep patterns, stress levels, and health goals
                  through a simple questionnaire.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="hover-elevate border-border/50" data-testid="card-step-2">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Describe Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Select from a comprehensive symptom checklist or describe what you're
                  experiencing in your own words.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="hover-elevate border-border/50" data-testid="card-step-3">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Get Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Receive personalized preventive guidance based on Ayurvedic principles
                  and AI-powered health analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features - Grid layout with icons */}
      <section className="py-16 md:py-20 px-6 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              What You'll Discover
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Personalized Health Insights
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 p-4 rounded-xl bg-background border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Dosha Balance Assessment</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Understand your unique mind-body constitution (Vata, Pitta, Kapha)
                  and identify current imbalances.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-4 rounded-xl bg-background border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Lifestyle Recommendations</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get personalized daily habits, sleep routines, and stress management
                  techniques tailored to your constitution.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-4 rounded-xl bg-background border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Food Preferences</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Discover which foods support your balance and which to avoid,
                  based on Ayurvedic dietary principles.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 p-4 rounded-xl bg-background border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Safety Guardrails</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our system identifies when professional consultation is recommended
                  and never auto-prescribes medicines.
                </p>
              </div>
            </div>
          </div>

          {/* CTA at bottom */}
          <div className="text-center mt-12">
            <Link href="/patient">
              <Button size="lg" className="gap-2" data-testid="button-start-now">
                Enter Portal
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-8 px-6 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This platform provides educational and preventive wellness information only.
            It is not a substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or qualified health provider with any
            questions you may have regarding a medical condition.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-4">
            © 2026 AIyuv. Built with care for your wellness.
          </p>
        </div>
      </footer>
    </div>
  );
}
