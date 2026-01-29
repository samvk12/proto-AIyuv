import { Link } from "wouter";
import { Activity, MessageSquare, BarChart3, UtensilsCrossed } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const actions = [
  { 
    label: "Assessment", 
    icon: Activity, 
    path: "/quiz",
    bgColor: "bg-white",
    iconColor: "text-primary",
    testId: "action-assessment"
  },
  { 
    label: "AI Chat", 
    icon: MessageSquare, 
    path: "/symptoms",
    bgColor: "bg-white",
    iconColor: "text-blue-500",
    testId: "action-chat"
  },
  { 
    label: "Analytics", 
    icon: BarChart3, 
    path: "/results",
    bgColor: "bg-white",
    iconColor: "text-emerald-500",
    testId: "action-analytics"
  },
  { 
    label: "Diet Plan", 
    icon: UtensilsCrossed, 
    path: "/results",
    bgColor: "bg-white",
    iconColor: "text-purple-500",
    testId: "action-diet"
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger asChild>
            <Link href={action.path}>
              <button 
                className="action-btn w-full hover-elevate"
                data-testid={action.testId}
              >
                <div className={`w-12 h-12 rounded-xl bg-card dark:bg-card shadow-sm flex items-center justify-center border border-border`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to {action.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
