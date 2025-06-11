import { savePollDraft } from "../actions/poll-actions";
import { toast } from "sonner";
import { isFail, isOk } from "@/lib/result";
import { useActionState, useEffect } from "react";

export function useCreatePollDraftMutation() {
  const [state, formAction, isPending] = useActionState(savePollDraft, null);

  useEffect(() => {
    if (state && isOk(state)) {
      toast.success("Poll saved successfully!");
    }

    if (state && isFail(state)) {
      toast.error(state.fail || "An error occurred while creating the poll");
    }
  }, [state]);

  return {
    formAction,
    isPending,
    state,
  };
}
