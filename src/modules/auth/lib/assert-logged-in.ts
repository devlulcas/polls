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
  targetPath?: string;
};

export function assertLoggedInServer(
  u: MaybeUser,
  options: AssertLoggedInServerOptions = { redirectTo: "/login" }
): asserts u is { user: User } {
  if (u.user !== null) {
    return;
  }

  const redirectTo = options.redirectTo ?? "/login";
  const searchParams = new URLSearchParams();
  searchParams.set("reason", "notLoggedIn");
  if (options.targetPath) {
    searchParams.set("target", options.targetPath);
  }
  redirect(`${redirectTo}?${searchParams.toString()}`);
}
