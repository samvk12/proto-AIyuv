import { supabase } from "@/lib/supabaseClient";

export type SymptomCheckerSeverity = "Mild" | "Moderate" | "High";

export interface UserSessionUpsert {
  username: string;
  last_seen_at?: string;

  latest_input?: unknown;
  latest_output?: unknown;

  latest_severity?: SymptomCheckerSeverity;
  latest_vata?: number;
  latest_pitta?: number;
  latest_kapha?: number;

  latest_sent_to_doctor?: boolean;
  latest_doctor_verified?: boolean;
  latest_doctor_notes?: string | null;
}

const TABLE = "user_sessions";

export async function upsertUserSession(payload: UserSessionUpsert) {
  const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: "username" });
  return { error };
}

