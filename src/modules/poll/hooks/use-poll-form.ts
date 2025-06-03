import { useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { PollFormData, pollFormSchema, StepFormData } from "../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  POLL_FORM_DEFAULT_VALUES,
  POLL_STEP_DEFAULT_VALUES,
} from "../lib/default-values";
import { useCreatePollMutation } from "./use-create-poll-mutation";
import { useCreatePollDraftMutation } from "./use-create-poll-draft-mutation";

export function usePollForm() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(pollFormSchema),
    defaultValues: POLL_FORM_DEFAULT_VALUES,
  });

  const createPollMutation = useCreatePollMutation();

  const saveDraftMutation = useCreatePollDraftMutation();

  const onSubmit = (data: PollFormData) => {
    startTransition(() => {
      createPollMutation.mutate(data);
    });
  };

  const onSaveDraft = () => {
    const data = form.getValues();
    startTransition(() => {
      saveDraftMutation.mutate(data as PollFormData, {
        onSuccess: () => {
          form.reset(POLL_FORM_DEFAULT_VALUES);
        },
      });
    });
  };

  const addStep = () => {
    const currentSteps = form.getValues("steps");
    form.setValue("steps", [...currentSteps, POLL_STEP_DEFAULT_VALUES]);
  };

  const updateSteps = (steps: StepFormData[]) => {
    form.setValue("steps", steps);
  };

  return {
    form,
    isPending,
    onSubmit,
    onSaveDraft,
    addStep,
    updateSteps,
    queryClient,
  };
}
