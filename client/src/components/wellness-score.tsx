import { Heart } from "lucide-react";

interface WellnessScoreProps {
  score: number;
  change?: number;
}

export function WellnessScore({ score, change }: WellnessScoreProps) {
  const progress = score;
  
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">Wellness Score</p>
        <p className="text-white text-4xl font-bold">{score}/100</p>
        {change !== undefined && (
          <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
            <span className="text-emerald-300">↗</span>
            +{change} from last week
          </p>
        )}
      </div>
      
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: 251.2,
              strokeDashoffset: 251.2 - (251.2 * progress) / 100,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
