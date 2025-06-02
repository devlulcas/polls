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
import { useFormState } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/modules/user/hooks/use-current-user-query";
import { extractMessage, isOk } from "@/lib/result";
import { FullPageLoader } from "@/components/common/full-page-loader";

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

  const success =
    (loginState && isOk(loginState)) || (signupState && isOk(signupState));

  const errorMessage =
    extractMessage(loginState) || extractMessage(signupState);

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(currentUserQueryOptions());
    }
  }, [success, queryClient]);

  return (
    <Form {...form}>
      {(signupIsPending || loginIsPending) && <FullPageLoader />}
      <form className="space-y-4">
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
          >
            {t("login")}
          </Button>
          <Button
            type="submit"
            formAction={signupFormAction}
            variant="outline"
            className="h-11 w-full"
          >
            {t("signup")}
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground p-0 h-auto"
          >
            {t("forgotPassword")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
