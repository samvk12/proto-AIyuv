import { Wind, Flame, Droplets, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DoshaBalanceProps {
  vata: number;
  pitta: number;
  kapha: number;
  showAlert?: boolean;
  primaryDosha?: "vata" | "pitta" | "kapha";
}

export function DoshaBalance({ vata, pitta, kapha, showAlert = true, primaryDosha }: DoshaBalanceProps) {
  const doshas = [
    { 
      name: "Vata", 
      value: vata, 
      icon: Wind, 
      color: "text-blue-500",
      barClass: "dosha-bar-vata",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      name: "Pitta", 
      value: pitta, 
      icon: Flame, 
      color: "text-red-500",
      barClass: "dosha-bar-pitta",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    },
    { 
      name: "Kapha", 
      value: kapha, 
      icon: Droplets, 
      color: "text-green-500",
      barClass: "dosha-bar-kapha",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
  ];

  // Determine which dosha is elevated
  const elevated = doshas.reduce((prev, curr) => 
    curr.value > prev.value ? curr : prev
  );

  const getAlertMessage = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case "vata":
        return "Your Vata is elevated. Consider warm foods and regular sleep.";
      case "pitta":
        return "Your Pitta is elevated. Consider cooling foods and calming activities.";
      case "kapha":
        return "Your Kapha is elevated. Consider light foods and regular exercise.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-5">
      {doshas.map((dosha) => (
        <div key={dosha.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <div className={`w-8 h-8 rounded-full ${dosha.bgColor} flex items-center justify-center`}>
                    <dosha.icon className={`w-4 h-4 ${dosha.color}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dosha.name} - {dosha.name === "Vata" ? "Air & Space" : dosha.name === "Pitta" ? "Fire & Water" : "Earth & Water"}</p>
                </TooltipContent>
              </Tooltip>
              <span className="font-medium">{dosha.name}</span>
            </div>
            <span className={`font-semibold ${dosha.color}`}>{dosha.value}%</span>
          </div>
          
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`dosha-bar ${dosha.barClass}`}
              style={{ width: `${dosha.value}%` }}
            />
          </div>
        </div>
      ))}

      {showAlert && elevated.value > 50 && (
        <div className="alert-box alert-box-warning mt-4 smooth-appear">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Alert:</span> {getAlertMessage(primaryDosha || elevated.name)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
