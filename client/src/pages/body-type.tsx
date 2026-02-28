import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wind, Flame, Droplets, BookOpen } from "lucide-react";

// ========================
// BODY TYPE / DOSHA EDUCATION PAGE
// Reference: Spec Section 1 - "Learn About Your Body Type" CTA
// ========================

const doshaInfo = [
  {
    name: "Vata",
    element: "Air + Space",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    characteristics: [
      "Creative and quick-thinking",
      "Naturally slim build",
      "Dry skin and hair tendency",
      "Variable energy levels",
      "Light, restless sleep",
    ],
    balanceTips: [
      "Follow regular routines",
      "Stay warm and grounded",
      "Eat warm, nourishing foods",
      "Practice calming activities",
    ],
  },
  {
    name: "Pitta",
    element: "Fire + Water",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    characteristics: [
      "Sharp intellect and focus",
      "Medium, athletic build",
      "Warm body temperature",
      "Strong digestion",
      "Natural leadership qualities",
    ],
    balanceTips: [
      "Stay cool in hot weather",
      "Avoid spicy, acidic foods",
      "Take regular breaks",
      "Practice moderation",
    ],
  },
  {
    name: "Kapha",
    element: "Earth + Water",
    icon: Droplets,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    characteristics: [
      "Calm and steady nature",
      "Solid, strong build",
      "Smooth, moist skin",
      "Deep, restful sleep",
      "Loyal and nurturing",
    ],
    balanceTips: [
      "Stay active daily",
      "Rise early in the morning",
      "Embrace variety and change",
      "Choose light, warming foods",
    ],
  },
];

export default function BodyType() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-3">
            Discover Your Body Type
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            In Ayurveda, every person has a unique constitution called Prakriti,
            determined by three doshas: Vata, Pitta, and Kapha. Understanding your
            dominant dosha helps personalize your wellness journey.
          </p>
        </div>
      </div>

      {/* Dosha Cards */}
      <div className="grid gap-6 mb-12">
        {doshaInfo.map((dosha) => (
          <Card
            key={dosha.name}
            className={`border-2 ${dosha.borderColor}`}
            data-testid={`card-dosha-${dosha.name.toLowerCase()}`}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${dosha.bgColor}`}>
                  <dosha.icon className={`w-8 h-8 ${dosha.color}`} />
                </div>
                <div>
                  <CardTitle className="text-2xl">{dosha.name}</CardTitle>
                  <CardDescription className="text-base">
                    {dosha.element}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Key Characteristics</h4>
                  <ul className="space-y-2">
                    {dosha.characteristics.map((char, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`w-1.5 h-1.5 rounded-full ${dosha.color.replace("text-", "bg-")}`} />
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Balance Tips</h4>
                  <ul className="space-y-2">
                    {dosha.balanceTips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`w-1.5 h-1.5 rounded-full ${dosha.color.replace("text-", "bg-")}`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-muted/30 rounded-lg p-8">
        <h2 className="text-xl font-serif font-bold mb-3">
          Ready to Discover Your Constitution?
        </h2>
        <p className="text-muted-foreground mb-6">
          Take our Self Health Check to get personalized insights based on your
          unique mind-body type.
        </p>
        <Button size="lg" data-testid="button-start-check" disabled>
          Start Health Check
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Locked • Coming Soon
        </p>
      </div>
    </div>
  );
}
