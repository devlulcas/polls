import { useMutation } from "@tanstack/react-query";
import { createPoll } from "../actions/poll-actions";
import { toast } from "sonner";
import { unwrap } from "@/lib/result";

export function useCreatePollMutation() {
  return useMutation({
    mutationFn: createPoll,
    onSuccess: (result) => {
      unwrap(result);
      toast.success("Poll created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred while creating the poll");
    },
  });
}
