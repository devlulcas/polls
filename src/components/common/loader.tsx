import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type LoaderProps = React.ComponentProps<typeof LoaderIcon>

export function Loader({className, ...props}: LoaderProps = {}) {
    const t = useTranslations("common.loader");
  return (  
    <LoaderIcon {...props} className={cn("animate-spin", className)} aria-label={t("ariaLabel")} aria-busy={true} />
  );
}