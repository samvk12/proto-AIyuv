import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DoshaResult, DoshaType } from "@shared/schema";
import { 
  Leaf, 
  Heart, 
  Sun, 
  UtensilsCrossed, 
  Activity, 
  Dumbbell, 
  Flower2,
  ArrowLeft,
  Share2,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

export default function Results() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<DoshaResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("doshaResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      setLocation("/quiz");
    }
  }, [setLocation]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Flower2 className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  const getDoshaIcon = (dosha: DoshaType) => {
    switch (dosha) {
      case "vata":
        return <Sun className="w-6 h-6" />;
      case "pitta":
        return <Heart className="w-6 h-6" />;
      case "kapha":
        return <Leaf className="w-6 h-6" />;
    }
  };

  const getDoshaColors = (dosha: DoshaType) => {
    switch (dosha) {
      case "vata":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/50",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
          gradient: "from-blue-500 to-blue-600",
          bar: "bg-blue-500",
        };
      case "pitta":
        return {
          bg: "bg-red-100 dark:bg-red-900/50",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
          gradient: "from-red-500 to-red-600",
          bar: "bg-red-500",
        };
      case "kapha":
        return {
          bg: "bg-green-100 dark:bg-green-900/50",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
          gradient: "from-green-500 to-green-600",
          bar: "bg-green-500",
        };
    }
  };

  const primaryColors = getDoshaColors(result.primaryDosha);
  const maxBalance = Math.max(result.balance.vata, result.balance.pitta, result.balance.kapha);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4 pb-24 md:pb-8">
      <div className="container max-w-4xl mx-auto smooth-appear">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" data-testid="button-share">
              <Share2 className="w-4 h-4" />
            </Button>
            <Link href="/quiz">
              <Button variant="outline" className="gap-2" data-testid="button-retake">
                <RefreshCw className="w-4 h-4" />
                Retake
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Result Card */}
        <Card className={`mb-8 ${primaryColors.border} overflow-hidden`}>
          <div className={`bg-gradient-to-r ${primaryColors.gradient} p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                {getDoshaIcon(result.primaryDosha)}
              </div>
              <div>
                <p className="text-white/80 text-sm">Your Primary Dosha</p>
                <h1 className="text-3xl md:text-4xl font-serif font-bold capitalize" data-testid="text-primary-dosha">
                  {result.primaryDosha}
                </h1>
              </div>
            </div>
            {result.secondaryDosha && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Secondary: {result.secondaryDosha}
              </Badge>
            )}
          </div>
          
          <CardContent className="pt-6 pb-6 px-6">
            <p className="text-muted-foreground mb-6" data-testid="text-description">
              {result.description}
            </p>

            {/* Dosha Balance Chart */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Your Dosha Balance</h3>
              <div className="space-y-4">
                {(["vata", "pitta", "kapha"] as DoshaType[]).map((dosha) => {
                  const colors = getDoshaColors(dosha);
                  const percentage = (result.balance[dosha] / maxBalance) * 100;
                  return (
                    <div key={dosha} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={`capitalize font-medium ${colors.text}`}>{dosha}</span>
                        <span className="text-muted-foreground">{result.balance[dosha]}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                          data-testid={`bar-${dosha}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h3 className="font-semibold mb-4">Key Characteristics</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.characteristics.map((char, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${primaryColors.text}`} />
                    <span className="text-sm">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diet" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="diet" className="gap-2" data-testid="tab-diet">
                  <UtensilsCrossed className="w-4 h-4 hidden sm:block" />
                  Diet
                </TabsTrigger>
                <TabsTrigger value="lifestyle" className="gap-2" data-testid="tab-lifestyle">
                  <Activity className="w-4 h-4 hidden sm:block" />
                  Lifestyle
                </TabsTrigger>
                <TabsTrigger value="exercise" className="gap-2" data-testid="tab-exercise">
                  <Dumbbell className="w-4 h-4 hidden sm:block" />
                  Exercise
                </TabsTrigger>
                <TabsTrigger value="herbs" className="gap-2" data-testid="tab-herbs">
                  <Flower2 className="w-4 h-4 hidden sm:block" />
                  Herbs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="diet" className="space-y-3" data-testid="content-diet">
                {result.recommendations.diet.map((item, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${primaryColors.bg}`}>
                    <UtensilsCrossed className={`w-5 h-5 mt-0.5 ${primaryColors.text}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-3" data-testid="content-lifestyle">
                {result.recommendations.lifestyle.map((item, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${primaryColors.bg}`}>
                    <Activity className={`w-5 h-5 mt-0.5 ${primaryColors.text}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="exercise" className="space-y-3" data-testid="content-exercise">
                {result.recommendations.exercise.map((item, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${primaryColors.bg}`}>
                    <Dumbbell className={`w-5 h-5 mt-0.5 ${primaryColors.text}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="herbs" className="space-y-3" data-testid="content-herbs">
                {result.recommendations.herbs.map((item, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${primaryColors.bg}`}>
                    <Flower2 className={`w-5 h-5 mt-0.5 ${primaryColors.text}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Symptom Checker CTA */}
        <Card className="mt-8 bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="py-8 text-center">
            <Flower2 className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Experiencing Any Symptoms?</h3>
            <p className="text-muted-foreground mb-4">
              Use our symptom checker to identify imbalances and get targeted Ayurvedic remedies.
            </p>
            <Link href="/symptoms">
              <Button data-testid="button-symptom-checker">
                Check Symptoms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
