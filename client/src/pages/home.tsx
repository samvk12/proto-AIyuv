import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WellnessScore } from "@/components/wellness-score";
import { QuickActions } from "@/components/quick-actions";
import { DoshaBalance } from "@/components/dosha-balance";
import { PersonalizedPlan } from "@/components/personalized-plan";
import { 
  Bell,
  User,
  ArrowRight,
  Sparkles,
  Heart,
  Brain,
  Activity,
  Flower2,
  CheckCircle2,
  Leaf,
  Sun
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [hasResults, setHasResults] = useState(false);
  const [doshaData, setDoshaData] = useState<{
    vata: number;
    pitta: number;
    kapha: number;
    primaryDosha: "vata" | "pitta" | "kapha";
  } | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("doshaResult");
    if (savedResult) {
      try {
        const result = JSON.parse(savedResult);
        setHasResults(true);
        setDoshaData({
          vata: result.balance.vata,
          pitta: result.balance.pitta,
          kapha: result.balance.kapha,
          primaryDosha: result.primaryDosha,
        });
      } catch (e) {
        setHasResults(false);
      }
    }
  }, []);

  // Show dashboard if user has taken the quiz
  if (hasResults && doshaData) {
    return <DashboardView doshaData={doshaData} />;
  }

  // Show landing page for new users
  return <LandingView />;
}

interface DashboardViewProps {
  doshaData: {
    vata: number;
    pitta: number;
    kapha: number;
    primaryDosha: "vata" | "pitta" | "kapha";
  };
}

function DashboardView({ doshaData }: DashboardViewProps) {
  const prakrutiLabel = doshaData.primaryDosha.charAt(0).toUpperCase() + doshaData.primaryDosha.slice(1);
  
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Terracotta Header */}
      <div className="gradient-terracotta dark:gradient-terracotta-dark px-6 pt-6 pb-8 rounded-b-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg" data-testid="text-welcome">
                Welcome back!
              </h1>
              <p className="text-white/70 text-sm">{prakrutiLabel} Prakruti</p>
            </div>
          </div>
          <button className="relative" data-testid="button-notifications">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              3
            </span>
          </button>
        </div>

        {/* Wellness Score */}
        <WellnessScore score={87} change={5} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <QuickActions />
          </CardContent>
        </Card>
      </div>

      {/* Dosha Balance */}
      <div className="px-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <h2 className="font-semibold text-lg">Current Dosha Balance</h2>
            <Link href="/results">
              <button className="text-primary text-sm font-medium hover:underline" data-testid="link-view-details">
                View Details
              </button>
            </Link>
          </CardHeader>
          <CardContent>
            <DoshaBalance 
              vata={doshaData.vata} 
              pitta={doshaData.pitta} 
              kapha={doshaData.kapha}
              primaryDosha={doshaData.primaryDosha}
            />
          </CardContent>
        </Card>
      </div>

      {/* Today's Personalized Plan */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Today's Personalized Plan</h2>
        </div>
        <PersonalizedPlan />
      </div>

      {/* Quick Links */}
      <div className="px-6 mt-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/quiz">
            <Card className="hover-elevate cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Retake Quiz</p>
                  <p className="text-xs text-muted-foreground">Update your profile</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/symptoms">
            <Card className="hover-elevate cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Check Symptoms</p>
                  <p className="text-xs text-muted-foreground">Get AI insights</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LandingView() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Ayurvedic Wellness
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-6">
                Discover Your
                <span className="text-primary block">Natural Balance</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
                AIyuv combines ancient Ayurvedic wisdom with modern AI to provide personalized 
                health insights based on your unique body constitution (Dosha).
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/quiz">
                  <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-start-quiz">
                    Take Dosha Quiz
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/symptoms">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-symptom-checker">
                    Symptom Checker
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="absolute inset-8 rounded-full bg-card border border-border flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-2xl font-serif text-blue-600 dark:text-blue-400">V</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="text-2xl font-serif text-red-600 dark:text-red-400">P</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-2xl font-serif text-green-600 dark:text-green-400">K</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Vata • Pitta • Kapha</p>
                    <p className="text-xs text-muted-foreground mt-1">The Three Doshas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Your Path to Wellness
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understand your unique constitution and receive personalized recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-elevate border-border">
              <CardContent className="pt-6 pb-6 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dosha Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Take our quiz to discover your primary dosha and mind-body constitution.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate border-border">
              <CardContent className="pt-6 pb-6 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Symptom Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered symptom checker with targeted Ayurvedic remedies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate border-border">
              <CardContent className="pt-6 pb-6 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Flower2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Natural Remedies</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized recommendations for herbs, diet, and lifestyle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Doshas Overview */}
      <section className="py-16 bg-muted/30 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              The Three Doshas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The fundamental energies that govern our physical and mental processes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Vata */}
            <Card className="border-blue-200 dark:border-blue-800/50 bg-gradient-to-b from-blue-50/50 to-card dark:from-blue-950/20">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Sun className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Vata</h3>
                    <p className="text-xs text-muted-foreground">Air & Space</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Creative, energetic, and quick-thinking individuals.
                </p>
                <ul className="space-y-2">
                  {["Creative mindset", "Light body frame", "Variable energy"].map((trait) => (
                    <li key={trait} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Pitta */}
            <Card className="border-red-200 dark:border-red-800/50 bg-gradient-to-b from-red-50/50 to-card dark:from-red-950/20">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Pitta</h3>
                    <p className="text-xs text-muted-foreground">Fire & Water</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Intelligent, focused, and natural leaders.
                </p>
                <ul className="space-y-2">
                  {["Sharp intellect", "Athletic build", "Strong digestion"].map((trait) => (
                    <li key={trait} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-red-500" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Kapha */}
            <Card className="border-green-200 dark:border-green-800/50 bg-gradient-to-b from-green-50/50 to-card dark:from-green-950/20">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Kapha</h3>
                    <p className="text-xs text-muted-foreground">Earth & Water</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Calm, loving, and grounded individuals.
                </p>
                <ul className="space-y-2">
                  {["Calm nature", "Strong build", "Steady energy"].map((trait) => (
                    <li key={trait} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-xl mx-auto">
            <Flower2 className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Begin Your Wellness Journey
            </h2>
            <p className="text-muted-foreground mb-6">
              Take our quick assessment and discover personalized recommendations 
              tailored to your unique constitution.
            </p>
            <Link href="/quiz">
              <Button size="lg" className="gap-2" data-testid="button-start-quiz-cta">
                Start Free Assessment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-card border-t border-border px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-serif font-bold text-lg">AIyuv</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Bridging ancient wisdom with modern technology.
            </p>
            <div className="flex gap-6">
              <Link href="/quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Quiz
              </Link>
              <Link href="/symptoms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Symptoms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
