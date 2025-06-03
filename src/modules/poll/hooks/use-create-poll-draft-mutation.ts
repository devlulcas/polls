import { useMutation } from "@tanstack/react-query";
import { savePollDraft } from "../actions/poll-actions";
import { toast } from "sonner";
import { unwrap } from "@/lib/result";

export function useCreatePollDraftMutation() {
  return useMutation({
    mutationFn: savePollDraft,
    onSuccess: (result) => {
      unwrap(result);
      toast.success("Draft saved successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred while saving the draft");
    },
  });
}
