"use server";

import { fail, ok, Result } from "@/lib/result";
import { createClient } from "@/modules/supabase/lib/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(
  _: Result<null> | null,
  formData: FormData
): Promise<Result<null>> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return fail(error.message);
  }

  revalidatePath("/", "layout");
  return ok(null);
}

export async function signup(
  _: Result<null> | null,
  formData: FormData
): Promise<Result<null>> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return fail(error.message);
  }

  revalidatePath("/", "layout");
  return ok(null);
}
