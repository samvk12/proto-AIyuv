import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sun,
  Moon,
  HeartPulse,
  Shield,
  Activity,
  Utensils,
  StretchHorizontal,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import type { HealthCheckCase } from "@shared/schema";

const CHECKIN_STORAGE_KEY = "patientPortal.morningCheckin";

interface MorningCheckinState {
  answered: boolean;
  followedTasksYesterday: boolean | null;
}

export default function HealthDashboard() {
  const [, navigate] = useLocation();
  const [caseData, setCaseData] = useState<HealthCheckCase | null>(null);
  const [checkin, setCheckin] = useState<MorningCheckinState>({
    answered: false,
    followedTasksYesterday: null,
  });
  const preventionRef = useRef<HTMLDivElement | null>(null);
  const [highlightPrevention, setHighlightPrevention] = useState(false);

  useEffect(() => {
    const storedCase = localStorage.getItem("healthCheckCase");
    if (storedCase) {
      try {
        setCaseData(JSON.parse(storedCase));
      } catch {
        setCaseData(null);
      }
    }

    const storedCheckin = localStorage.getItem(CHECKIN_STORAGE_KEY);
    if (storedCheckin) {
      try {
        setCheckin(JSON.parse(storedCheckin));
      } catch {
        setCheckin({ answered: false, followedTasksYesterday: null });
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("focus") === "prevention") {
      preventionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightPrevention(true);
      const timer = window.setTimeout(() => setHighlightPrevention(false), 2200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleCheckin = (followed: boolean) => {
    const next: MorningCheckinState = { answered: true, followedTasksYesterday: followed };
    setCheckin(next);
    localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(next));
  };

  const doshaBalance = caseData?.healthSnapshot?.doshaVisualization;

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Sun className="w-4 h-4 text-primary" />
            Good day, welcome back
          </p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-1">
            Health Dashboard
          </h1>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <CalendarCheck className="w-3 h-3" />
          Daily Check-in
        </Badge>
      </div>

      {/* Morning Check-in */}
      {!checkin.answered ? (
        <Card className="mb-8 gradient-green-subtle border-primary/10 smooth-appear">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Moon className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-lg">
                  Did you follow the tasks given to you yesterday?
                </CardTitle>
                <CardDescription>
                  This helps us fine-tune today&apos;s lifestyle, diet, and exercise plan.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => handleCheckin(true)}
              data-testid="button-checkin-yes"
            >
              Yes, mostly
            </Button>
            <Button
              className="flex-1"
              size="lg"
              variant="outline"
              onClick={() => handleCheckin(false)}
              data-testid="button-checkin-no"
            >
              Not really
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 smooth-appear">
          <CardContent className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <HeartPulse className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Morning check-in recorded
                </p>
                <p className="text-xs text-muted-foreground">
                  {checkin.followedTasksYesterday
                    ? "Great job staying on track yesterday. Today’s plan builds on that momentum."
                    : "We’ll keep today gentle and supportive, and help you restart your routine."}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="self-start md:self-auto">
              Answered
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Daily Prescription */}
      {checkin.answered && (
        <div className="mb-10 space-y-4 smooth-appear">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-serif font-bold text-foreground">
              Daily Prescription
            </h2>
            <span className="text-xs text-muted-foreground">
              Lifestyle • Diet • Exercise
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Lifestyle</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Gentle adjustments you can apply today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Fix your wake-up and sleep window within a 30-minute range.</p>
                <p>• Take 3 mindful breathing breaks (2 minutes each) across the day.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Diet</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Simple food rules for balance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Prefer warm, freshly cooked meals over leftovers and packaged food.</p>
                <p>• Sip warm water or herbal tea instead of iced drinks.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <StretchHorizontal className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Exercise</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Move enough, without over-straining.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Aim for 20–30 minutes of light to moderate movement today.</p>
                <p>• End with 3–5 minutes of stretching and deep breathing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Dosha snapshot if available */}
      {doshaBalance && (
        <Card className="mb-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Your Dosha Snapshot
            </CardTitle>
            <CardDescription className="text-xs">
              Based on your last health check. Recheck if you feel different today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <DoshaRow label="Vata" value={doshaBalance.vata} tone="vata" />
            <DoshaRow label="Pitta" value={doshaBalance.pitta} tone="pitta" />
            <DoshaRow label="Kapha" value={doshaBalance.kapha} tone="kapha" />
          </CardContent>
        </Card>
      )}

      {/* Two primary action pillars */}
      <div className="grid md:grid-cols-2 gap-5 mb-16" ref={preventionRef}>
        <Card className="hover-elevate smooth-appear">
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold">Current Discomfort</h2>
                <p className="text-sm text-muted-foreground">
                  Experiencing pain, burning, heaviness, or any acute symptom right now?
                </p>
              </div>
            </div>
            <Button
              className="mt-2 gap-2"
              onClick={() => navigate("/symptom-intake")}
              data-testid="button-pillars-current-discomfort"
            >
              Start Symptom Check
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card
          className={`hover-elevate smooth-appear ${
            highlightPrevention ? "ring-2 ring-emerald-200 bg-emerald-50/50" : ""
          }`}
        >
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold">Prevention & Care</h2>
                <p className="text-sm text-muted-foreground">
                  Explore your dosha balance (Vata, Pitta, Kapha) and build long-term habits for stress, sleep,
                  movement, and diet.
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-700/80 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              Distinct from symptom checking — this focuses on your constitution and prevention plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/body-type">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  data-testid="button-pillars-body-type-quiz"
                >
                  Body Type Quiz
                </Button>
              </Link>
              <Button
                className="flex-1 gap-2"
                variant="ghost"
                onClick={() => navigate("/health-check/results")}
                disabled={!caseData}
                data-testid="button-pillars-prevention-plan"
              >
                View My Plan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DoshaRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "vata" | "pitta" | "kapha";
}) {
  const colorClass =
    tone === "vata" ? "dosha-bar-vata" : tone === "pitta" ? "dosha-bar-pitta" : "dosha-bar-kapha";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-accent/60 overflow-hidden">
        <div
          className={`dosha-bar ${colorClass}`}
          style={{ width: `${value}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

