import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, User } from "lucide-react";
import { useSymptomFlow } from "@/context/SymptomFlowContext";
import { upsertUserSession } from "@/lib/userSessions";

export default function PatientEnter() {
  const [, navigate] = useLocation();
  const { username, setUsername } = useSymptomFlow();
  const [value, setValue] = useState(username || "");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canContinue = value.trim().length >= 3;

  const handleContinue = async () => {
    const next = value.trim();
    if (!next) return;
    setSaving(true);
    setErrorMsg(null);
    setUsername(next);

    const { error } = await upsertUserSession({
      username: next,
      last_seen_at: new Date().toISOString(),
    });

    if (error) {
      setErrorMsg(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    navigate("/health-dashboard?focus=prevention");
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-2 bg-primary/5">
          <Badge variant="secondary" className="w-fit text-[11px]">
            Portal Login
          </Badge>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Portal Login
          </CardTitle>
          <CardDescription>
            Enter a username to continue. This is used to save your wellness inputs and results.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. ram123"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 characters. Avoid spaces.
            </p>
          </div>

          {errorMsg && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              Couldn’t save to Supabase: {errorMsg}
            </div>
          )}

          <Button
            size="lg"
            className="w-full gap-2"
            disabled={!canContinue || saving}
            onClick={handleContinue}
            data-testid="button-continue-patient"
          >
            {saving ? "Saving..." : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

