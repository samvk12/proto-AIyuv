import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vkppojagklhhzanbmzpr.supabase.co";
const supabaseAnonKey = "sb_publishable_DafEgWTpDkGCRVFoIn-zag_LR7STLcd";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);