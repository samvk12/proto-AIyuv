import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Leaf, 
  Heart, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Activity,
  Flower2,
  Sun
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-20 pb-32">
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
                  <Button size="lg" className="gap-2" data-testid="button-start-quiz">
                    Take Dosha Quiz
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/symptoms">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-symptom-checker">
                    Symptom Checker
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative w-80 h-80">
                {/* Decorative circles */}
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Your Path to Wellness
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understand your unique constitution and receive personalized recommendations 
              for diet, lifestyle, and herbal remedies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate border-border">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dosha Assessment</h3>
                <p className="text-muted-foreground">
                  Take our comprehensive quiz to discover your primary dosha and understand 
                  your unique mind-body constitution.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate border-border">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Symptom Analysis</h3>
                <p className="text-muted-foreground">
                  Identify imbalances through our AI-powered symptom checker and receive 
                  targeted Ayurvedic remedies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate border-border">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <Flower2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Natural Remedies</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations for herbs, diet, and lifestyle changes 
                  based on your constitution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Doshas Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              The Three Doshas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In Ayurveda, the three doshas—Vata, Pitta, and Kapha—are the fundamental 
              energies that govern our physical and mental processes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Vata */}
            <Card className="border-blue-200 dark:border-blue-800/50 bg-gradient-to-b from-blue-50/50 to-card dark:from-blue-950/20">
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Sun className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Vata</h3>
                    <p className="text-sm text-muted-foreground">Air & Space</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Governs movement and communication. Vata types are creative, 
                  energetic, and quick-thinking.
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
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">Pitta</h3>
                    <p className="text-sm text-muted-foreground">Fire & Water</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Governs transformation and metabolism. Pitta types are 
                  intelligent, focused, and natural leaders.
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
              <CardContent className="pt-8 pb-6 px-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">Kapha</h3>
                    <p className="text-sm text-muted-foreground">Earth & Water</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Governs structure and stability. Kapha types are calm, 
                  loving, and grounded individuals.
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
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <Flower2 className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Begin Your Wellness Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Understanding your dosha is the first step toward optimal health. 
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
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-serif font-bold text-xl">AIyuv</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Bridging ancient wisdom with modern technology for holistic wellness.
            </p>
            <div className="flex gap-6">
              <Link href="/quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dosha Quiz
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
