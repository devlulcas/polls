import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

type MaybeUser =
  | {
      user: User;
    }
  | {
      user: null;
    };

type AssertLoggedInServerOptions = {
  redirectTo?: string;
};

export function assertLoggedInServer(
  u: MaybeUser,
  options: AssertLoggedInServerOptions = { redirectTo: "/login" }
): asserts u is { user: User } {
  if (u.user !== null) {
    return;
  }

  if (options.redirectTo) {
    redirect(options.redirectTo);
  }
}
