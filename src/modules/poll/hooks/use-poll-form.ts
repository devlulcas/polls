import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { pollFormSchema, StepFormData } from "../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  POLL_FORM_DEFAULT_VALUES,
  POLL_STEP_DEFAULT_VALUES,
} from "../lib/default-values";

export function usePollForm() {
  const queryClient = useQueryClient();

  const form = useForm({
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
    form,
    addStep,
    updateSteps,
    queryClient,
  };
}
