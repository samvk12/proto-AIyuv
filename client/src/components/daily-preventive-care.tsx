import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { DailyPreventiveCare, PreventiveTip, DoshaType } from "@shared/schema";
import { 
  Bell, 
  Sunrise, 
  Utensils, 
  Droplets, 
  Moon, 
  Dumbbell, 
  Brain,
  Flame,
  ChevronRight,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  Leaf,
  Heart,
  Sun,
  Footprints,
  Coffee,
  Salad,
  Zap,
  Music,
  Palette,
  Waves,
  Snowflake,
  Gift,
  MessageCircle,
  Loader2
} from "lucide-react";

interface DailyPreventiveCareProps {
  primaryDosha: DoshaType;
  wellnessScore: number;
}

// Icon mapping for tip icons
const iconMap: Record<string, React.ElementType> = {
  sunrise: Sunrise,
  utensils: Utensils,
  droplets: Droplets,
  moon: Moon,
  footprints: Footprints,
  brain: Brain,
  clock: Clock,
  "cup-soda": Coffee,
  "moon-star": Moon,
  dumbbell: Dumbbell,
  heart: Heart,
  palette: Palette,
  carrot: Salad,
  leaf: Leaf,
  pause: Clock,
  salad: Salad,
  "glass-water": Droplets,
  snowflake: Snowflake,
  waves: Waves,
  "heart-handshake": Heart,
  umbrella: Sun,
  apple: Salad,
  bike: Dumbbell,
  smile: Sparkles,
  sparkles: Sparkles,
  "alarm-clock": Clock,
  flame: Flame,
  sun: Sun,
  zap: Zap,
  bed: Moon,
  coffee: Coffee,
  music: Music,
  target: Target,
  gift: Gift,
  "message-circle": MessageCircle,
};

// Category labels
const categoryLabels: Record<string, string> = {
  lifestyle: "Lifestyle",
  food: "Food & Diet",
  hydration: "Hydration",
  sleep: "Sleep",
  activity: "Activity",
  mental_wellness: "Mental Wellness",
};

// Category colors
const categoryColors: Record<string, string> = {
  lifestyle: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  hydration: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  sleep: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  activity: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  mental_wellness: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

// Dosha accent colors
const doshaAccents: Record<DoshaType, string> = {
  vata: "text-blue-600 dark:text-blue-400",
  pitta: "text-red-600 dark:text-red-400",
  kapha: "text-green-600 dark:text-green-400",
};

export function DailyPreventiveCareSection({ primaryDosha, wellnessScore }: DailyPreventiveCareProps) {
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());
  const [streakDays, setStreakDays] = useState(0);

  // Load completed tips and streak from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("preventiveCareProgress");
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setCompletedTips(new Set(data.completedTips));
      }
      setStreakDays(data.streakDays || 0);
    }
  }, []);

  // Fetch daily preventive care tips
  const { data: dailyCare, isLoading, error } = useQuery<DailyPreventiveCare>({
    queryKey: ["/api/preventive-care/daily", primaryDosha, wellnessScore],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/preventive-care/daily", {
        primaryDosha,
        wellnessScore,
        streakDays,
      });
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Toggle tip completion
  const toggleTipComplete = (tipId: string) => {
    const newCompleted = new Set(completedTips);
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId);
    } else {
      newCompleted.add(tipId);
    }
    setCompletedTips(newCompleted);

    // Save to localStorage
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("preventiveCareProgress", JSON.stringify({
      date: today,
      completedTips: Array.from(newCompleted),
      streakDays: newCompleted.size === (dailyCare?.tips.length || 0) ? streakDays + 1 : streakDays,
    }));
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !dailyCare) {
    return null;
  }

  const completionPercent = dailyCare.tips.length > 0 
    ? Math.round((completedTips.size / dailyCare.tips.length) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden" data-testid="section-preventive-care">
      {/* Notification-style header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground" data-testid="text-greeting">
              {dailyCare.greeting}
            </p>
            <p className="text-xs text-muted-foreground">
              Today's preventive tips based on your Prakriti
            </p>
          </div>
          {dailyCare.streakDays > 1 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Flame className="w-3 h-3 mr-1" />
              {dailyCare.streakDays} day streak
            </Badge>
          )}
        </div>
        
        {/* Focus area badge */}
        <div className="flex items-center gap-2 mt-3">
          <Target className={`w-4 h-4 ${doshaAccents[primaryDosha]}`} />
          <span className="text-sm font-medium">Today's Focus:</span>
          <Badge variant="outline" className="font-normal">
            {dailyCare.focusArea}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4 pb-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {completedTips.size} of {dailyCare.tips.length} completed
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium">{completionPercent}%</span>
          </div>
        </div>

        {/* Tips list */}
        <div className="space-y-4">
          {dailyCare.tips.map((tip, index) => (
            <TipCard 
              key={tip.id}
              tip={tip}
              index={index}
              isCompleted={completedTips.has(tip.id)}
              onToggle={() => toggleTipComplete(tip.id)}
            />
          ))}
        </div>

        {/* All completed message */}
        {completionPercent === 100 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center smooth-appear">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-medium text-green-800 dark:text-green-300">
              Amazing! You've completed all today's tips!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Keep up this consistency for better health
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Individual tip card component
function TipCard({ 
  tip, 
  index, 
  isCompleted, 
  onToggle 
}: { 
  tip: PreventiveTip; 
  index: number; 
  isCompleted: boolean; 
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[tip.icon] || Sparkles;

  return (
    <div 
      className={`border rounded-xl p-4 transition-all duration-200 ${
        isCompleted 
          ? "bg-muted/50 border-primary/30" 
          : "bg-card hover-elevate"
      }`}
      data-testid={`tip-card-${index}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            data-testid={`checkbox-tip-${index}`}
          />
        </div>

        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[tip.category]}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className={`text-xs ${categoryColors[tip.category]}`}>
              {categoryLabels[tip.category]}
            </Badge>
          </div>

          <h4 className={`font-medium mb-1 ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
            {tip.title}
          </h4>

          <p className={`text-sm text-muted-foreground ${isCompleted ? "line-through" : ""}`}>
            {tip.description}
          </p>

          {/* Expanded details */}
          {expanded && !isCompleted && (
            <div className="mt-3 pt-3 border-t border-border space-y-2 smooth-appear">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Benefit:</span>
                  <p className="text-sm text-muted-foreground">{tip.benefit}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">Prevention:</span>
                  <p className="text-sm text-muted-foreground">{tip.riskPrevention}</p>
                </div>
              </div>
            </div>
          )}

          {/* Expand button */}
          {!isCompleted && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 h-7 px-2 text-xs gap-1"
              onClick={() => setExpanded(!expanded)}
              data-testid={`button-expand-tip-${index}`}
            >
              {expanded ? "Show less" : "Learn more"}
              <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
