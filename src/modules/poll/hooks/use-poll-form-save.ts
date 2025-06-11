import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { PollFormData, pollFormSchema, StepFormData } from "../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  POLL_FORM_DEFAULT_VALUES,
  POLL_STEP_DEFAULT_VALUES,
} from "../lib/default-values";
import { useCreatePollMutation } from "./use-create-poll-mutation";
import { useCreatePollDraftMutation } from "./use-create-poll-draft-mutation";
import { isOk } from "@/lib/result";

export function usePollFormSave(form: UseFormReturn<PollFormData>) {
  const [isPending, startTransition] = useTransition();

  const createPollMutation = useCreatePollMutation();
  const saveDraftMutation = useCreatePollDraftMutation();

  useEffect(() => {
    if (createPollMutation.state && isOk(createPollMutation.state)) {
      form.reset(POLL_FORM_DEFAULT_VALUES);
    }
  }, [createPollMutation.state]);

  const onSubmit = (data: PollFormData) => {
    startTransition(() => {
      createPollMutation.formAction(data);
    });
  };

  const onSaveDraft = () => {
    const data = form.getValues();
    startTransition(() => {
      saveDraftMutation.formAction(data as PollFormData);
    });
  };

  return {
    isPending,
    onSubmit,
    onSaveDraft,
  };
}
