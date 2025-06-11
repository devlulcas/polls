import { useQueryClient } from "@tanstack/react-query";
import { useForm, UseFormReturn } from "react-hook-form";
import { PollFormData, pollFormSchema, StepFormData } from "../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  POLL_FORM_DEFAULT_VALUES,
  POLL_STEP_DEFAULT_VALUES,
} from "../lib/default-values";

export function usePollForm() {
  const queryClient = useQueryClient();

  const form = useForm<PollFormData>({
    mode: "onSubmit",
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(pollFormSchema),
    defaultValues: POLL_FORM_DEFAULT_VALUES,
  });

  const addStep = () => {
    const currentSteps = form.getValues("steps");
    form.setValue("steps", [...currentSteps, POLL_STEP_DEFAULT_VALUES]);
  };

  const updateSteps = (steps: StepFormData[]) => {
    form.setValue("steps", steps);
  };

  return {
    // !!! WHY THE DERIVED TYPE IS NOT WORKING?
    form: form as unknown as UseFormReturn<PollFormData>,
    addStep,
    updateSteps,
    queryClient,
  };
}
