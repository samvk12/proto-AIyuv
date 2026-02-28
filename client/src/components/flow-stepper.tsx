import { cn } from "@/lib/utils";

interface FlowStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export default function FlowStepper({ steps, currentStep, className }: FlowStepperProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                isComplete && "border-primary bg-primary text-white",
                isActive && "border-primary text-primary",
                !isComplete && !isActive && "border-border text-muted-foreground",
              )}
              aria-hidden="true"
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                isActive && "text-foreground",
                isComplete && "text-primary",
                !isComplete && !isActive && "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <span className="hidden sm:inline-block h-px w-6 bg-border" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
