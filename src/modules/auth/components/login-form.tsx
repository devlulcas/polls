import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { useLoginForm } from "../hooks/use-login-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, signup } from "../actions/auth-actions";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/modules/user/hooks/use-current-user-query";
import { extractMessage, isOk } from "@/lib/result";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const form = useLoginForm();
  const t = useTranslations("auth.loginForm");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const [signupState, signupFormAction, signupIsPending] = useActionState(
    signup,
    null
  );

  const [loginState, loginFormAction, loginIsPending] = useActionState(
    login,
    null
  );

  const pending = signupIsPending || loginIsPending;

  const success =
    (loginState && isOk(loginState)) || (signupState && isOk(signupState));

  const errorMessage =
    extractMessage(loginState) || extractMessage(signupState);

  const router = useRouter();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(currentUserQueryOptions());
      form.reset();
      router.push("/dashboard");
    }
  }, [success, queryClient]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        {errorMessage && (
          <AnimatePresence key={errorMessage}>
            <motion.div
              initial={{ opacity: 0, y: -70 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -70 }}
              transition={{ duration: 0.3 }}
              className="h-20 bg-gradient-to-b from-destructive/50 to-background backdrop-blur-xs p-2 flex justify-center items-center gap-2 fixed top-0 inset-x-0 z-50 "
            >
              <span className="text-destructive font-serif text-xl uppercase">
                {errorMessage}
              </span>
            </motion.div>
          </AnimatePresence>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                {t("email")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className="h-11"
                  disabled={pending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                {t("password")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 pr-10"
                    disabled={pending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            formAction={loginFormAction}
            className="h-11 w-full"
            disabled={pending}
          >
            {t("login")}
          </Button>
          <Button
            type="submit"
            formAction={signupFormAction}
            variant="outline"
            className="h-11 w-full"
            disabled={pending}
          >
            {t("signup")}
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground p-0 h-auto"
            disabled={pending}
          >
            {t("forgotPassword")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
