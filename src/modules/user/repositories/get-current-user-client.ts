import { createClient } from "@/modules/supabase/lib/client";

export async function getCurrentUserClient() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("Not logged in", { cause: error });
  }

  return session.user;
}
