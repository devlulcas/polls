import { createPoll } from "../actions/poll-actions";
import { toast } from "sonner";
import { isFail, isOk } from "@/lib/result";
import { useActionState, useEffect } from "react";

export function useCreatePollMutation() {
  const [state, formAction, isPending] = useActionState(createPoll, null);

  useEffect(() => {
    if (state && isOk(state)) {
      toast.success("Poll created successfully!");
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
