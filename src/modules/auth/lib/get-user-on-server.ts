import { createClient } from "@/modules/supabase/lib/server";
import { cache } from "react";

async function getUserOnServerImpl() {
  const supabase = await createClient();
  return supabase.auth.getUser();
}

export const getUserOnServer = cache(getUserOnServerImpl);
