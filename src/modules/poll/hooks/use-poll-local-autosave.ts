import { UseFormReturn } from "react-hook-form";
import { PollFormData } from "../lib/schemas";
import { useCallback, useEffect, useState } from "react";
import {
  UncommittedPoll,
  useAutoSaveContext,
} from "../contexts/polls-autosave-context";

const STORAGE_KEY_CURRENT_POLL = "current_poll";

export function usePollLocalAutosave(form: UseFormReturn<PollFormData>): {
  saving: boolean;
} {
  const title = form.watch("title");
  const [saving, setSaving] = useState(false);

  const isDirty = form.formState.isDirty;
  const isSubmitted = form.formState.isSubmitted;
  const getValues = form.getValues;

  const { dispatch } = useAutoSaveContext();

  const showSavingLoader = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 500);
  }, []);

  const savePoll = useCallback((data: PollFormData) => {
    const old = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY_CURRENT_POLL) || "{}"
    ).data;
    if (JSON.stringify(old) === JSON.stringify(data)) {
      return;
    }

    const poll: UncommittedPoll = {
      id: "uncommitted",
      data,
      lastSaved: Date.now(),
    };

    showSavingLoader();
    window.localStorage.setItem(STORAGE_KEY_CURRENT_POLL, JSON.stringify(poll));

    dispatch({
      type: "update",
      payload: { idx: 0, data },
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty && !isSubmitted && title) {
        savePoll(getValues());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [savePoll, isDirty, isSubmitted, title, getValues]);

  return { saving };
}
