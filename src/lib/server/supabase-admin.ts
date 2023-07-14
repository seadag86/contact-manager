import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";
import type { Database } from "$lib/supabase-types";

export const supabaseAdmin = createClient<Database>(
	ENV.PUBLIC_SUPABASE_URL,
	ENV.SUPABASE_SERVICE_ROLE_KEY
);
