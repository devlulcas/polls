import { useFormContext } from "react-hook-form";
import { usePollLocalAutosave } from "../hooks/use-poll-local-autosave";
import { PollFormData } from "../lib/schemas";
import { useTranslations } from "next-intl";
import { Loader } from "@/components/common/loader";

export function PollAutosave() {
  const form = useFormContext<PollFormData>();
  const { saving } = usePollLocalAutosave(form);
  const t = useTranslations("poll.autosave.localAutosave");

  if (saving) {
    return (
      <p className="text-sm font-normal text-muted-foreground flex items-center gap-2 fixed top-[var(--h-header)] -mt-1 p-2 rounded-b-2xl bg-card border border-t-0 left-1/2 -translate-x-1/2">
        <Loader className="size-3" />
        {t("saving")}
      </p>
    );
  }

  return null;
}
