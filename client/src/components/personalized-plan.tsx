import { UtensilsCrossed, Flower2, Pill, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PlanItem {
  id: number;
  title: string;
  description: string;
  icon: "meal" | "yoga" | "herb";
  completed?: boolean;
  actionLabel?: string;
}

const defaultPlanItems: PlanItem[] = [
  {
    id: 1,
    title: "Breakfast",
    description: "Warm oatmeal with ghee & dates",
    icon: "meal",
    completed: false,
  },
  {
    id: 2,
    title: "Morning Yoga",
    description: "20 min grounding practice",
    icon: "yoga",
    completed: false,
    actionLabel: "Start",
  },
  {
    id: 3,
    title: "Ashwagandha",
    description: "Take with warm milk",
    icon: "herb",
    completed: true,
  },
];

const iconMap = {
  meal: { icon: UtensilsCrossed, bgColor: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
  yoga: { icon: Flower2, bgColor: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
  herb: { icon: Pill, bgColor: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
};

interface PersonalizedPlanProps {
  items?: PlanItem[];
}

export function PersonalizedPlan({ items = defaultPlanItems }: PersonalizedPlanProps) {
  const [planItems, setPlanItems] = useState(items);

  const toggleComplete = (id: number) => {
    setPlanItems(planItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-3 stagger-children">
      {planItems.map((item) => {
        const iconConfig = iconMap[item.icon];
        const Icon = iconConfig.icon;

        return (
          <div 
            key={item.id} 
            className="plan-item hover-elevate"
            data-testid={`plan-item-${item.id}`}
          >
            <div className={`w-12 h-12 rounded-xl ${iconConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${iconConfig.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{item.description}</p>
            </div>
            
            {item.completed ? (
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : item.actionLabel ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toggleComplete(item.id)}
                data-testid={`plan-action-${item.id}`}
              >
                {item.actionLabel}
              </Button>
            ) : (
              <button 
                onClick={() => toggleComplete(item.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
