import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { symptoms } from "@/lib/quiz-data";
import type { SymptomAnalysis } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Leaf, 
  Heart, 
  Sun,
  Loader2, 
  AlertCircle,
  Stethoscope,
  UtensilsCrossed,
  Activity,
  Flower2,
  CheckCircle2
} from "lucide-react";

export default function Symptoms() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (symptomIds: number[]) => {
      const response = await apiRequest("POST", "/api/symptoms/analyze", { symptoms: symptomIds });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  const toggleSymptom = (id: number) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length > 0) {
      analyzeMutation.mutate(selectedSymptoms);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setSelectedSymptoms([]);
  };

  const groupedSymptoms = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom);
    return acc;
  }, {} as Record<string, typeof symptoms>);

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case "vata":
        return <Sun className="w-6 h-6" />;
      case "pitta":
        return <Heart className="w-6 h-6" />;
      case "kapha":
        return <Leaf className="w-6 h-6" />;
      default:
        return <Flower2 className="w-6 h-6" />;
    }
  };

  const getDoshaColors = (dosha: string) => {
    switch (dosha) {
      case "vata":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/50",
          text: "text-blue-700 dark:text-blue-300",
          gradient: "from-blue-500 to-blue-600",
        };
      case "pitta":
        return {
          bg: "bg-red-100 dark:bg-red-900/50",
          text: "text-red-700 dark:text-red-300",
          gradient: "from-red-500 to-red-600",
        };
      case "kapha":
        return {
          bg: "bg-green-100 dark:bg-green-900/50",
          text: "text-green-700 dark:text-green-300",
          gradient: "from-green-500 to-green-600",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-900/50",
          text: "text-gray-700 dark:text-gray-300",
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "significant":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (analysis) {
    const colors = getDoshaColors(analysis.imbalancedDosha);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" className="gap-2" onClick={resetAnalysis} data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </Button>
          </div>

          {/* Analysis Result */}
          <Card className="mb-8 overflow-hidden">
            <div className={`bg-gradient-to-r ${colors.gradient} p-8 text-white`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  {getDoshaIcon(analysis.imbalancedDosha)}
                </div>
                <div>
                  <p className="text-white/80 text-sm">Imbalanced Dosha Detected</p>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold capitalize" data-testid="text-imbalanced-dosha">
                    {analysis.imbalancedDosha} Imbalance
                  </h1>
                </div>
              </div>
              <Badge className={getSeverityColor(analysis.severity)}>
                {analysis.severity} severity
              </Badge>
            </div>

            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This analysis is for informational purposes only and should not replace 
                  professional medical advice. Please consult with a qualified healthcare 
                  provider for proper diagnosis and treatment.
                </p>
              </div>

              {/* Remedies */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-primary" />
                  Recommended Remedies
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.remedies.map((remedy) => (
                    <Card key={remedy.id} className="hover-elevate">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold mb-2" data-testid={`text-remedy-${remedy.id}`}>
                          {remedy.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {remedy.description}
                        </p>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {remedy.ingredients.map((ing, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {ing}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">How to use:</span> {remedy.instructions}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Dietary Advice */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  Dietary Recommendations
                </h3>
                <div className="space-y-3">
                  {analysis.dietaryAdvice.map((advice, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${colors.bg}`}>
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 ${colors.text}`} />
                      <span>{advice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Advice */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Lifestyle Recommendations
                </h3>
                <div className="space-y-3">
                  {analysis.lifestyleAdvice.map((advice, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${colors.bg}`}>
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 ${colors.text}`} />
                      <span>{advice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="py-8 text-center">
              <Stethoscope className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Want to Know Your Dosha?</h3>
              <p className="text-muted-foreground mb-4">
                Take our comprehensive quiz to discover your unique constitution.
              </p>
              <Link href="/quiz">
                <Button data-testid="button-take-quiz">
                  Take Dosha Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="w-8 h-8 text-primary" />
            <span className="font-serif font-bold text-2xl">Symptom Checker</span>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select the symptoms you're experiencing to receive personalized 
            Ayurvedic insights and natural remedy recommendations.
          </p>
        </div>

        {/* Selected Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? "s" : ""} selected
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={selectedSymptoms.length === 0 || analyzeMutation.isPending}
            className="gap-2"
            data-testid="button-analyze"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </div>

        {/* Symptoms by Category */}
        <div className="space-y-6">
          {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid sm:grid-cols-2 gap-3">
                  {categorySymptoms.map((symptom) => (
                    <label
                      key={symptom.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSymptoms.includes(symptom.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`checkbox-symptom-${symptom.id}`}
                    >
                      <Checkbox
                        checked={selectedSymptoms.includes(symptom.id)}
                        onCheckedChange={() => toggleSymptom(symptom.id)}
                      />
                      <span className="text-sm">{symptom.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {analyzeMutation.isError && (
          <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-center">
            <p className="text-destructive" data-testid="text-error">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
