"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { PollFormData } from "../lib/schemas";
import { useLocalStorage } from "@/hooks/use-local-storage";

const STORAGE_KEY_UNCOMMITTED_POLLS = "uncommitted_polls";

export type UncommittedPoll = {
  id: string;
  data: PollFormData;
  lastSaved: number;
};

type AutosaveContextType = {
  polls: UncommittedPoll[];
  dispatch: React.Dispatch<Action>;
};

const AutosaveContext = createContext<AutosaveContextType | null>(null);

export function useAutoSaveContext() {
  const context = useContext(AutosaveContext);
  if (!context) {
    throw new Error(
      "useAutoSaveContext must be used within an AutosaveProvider"
    );
  }
  return context;
}

export function PollsAutosaveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storedPolls, setStoredPolls] = useLocalStorage<UncommittedPoll[]>(
    STORAGE_KEY_UNCOMMITTED_POLLS,
    [],
    isUncommittedPollArray
  );

  const [polls, dispatch] = useReducer(reducer, storedPolls);

  const filteredPolls = useMemo(() => getUncommittedPolls(polls), [polls]);

  useEffect(() => {
    setStoredPolls(filteredPolls);
  }, [filteredPolls, setStoredPolls]);

  return (
    <AutosaveContext.Provider value={{ polls: filteredPolls, dispatch }}>
      {children}
    </AutosaveContext.Provider>
  );
}

type Action =
  | {
      type: "add";
      payload: UncommittedPoll;
    }
  | {
      type: "remove";
      payload: number;
    }
  | {
      type: "update";
      payload: {
        idx: number;
        data: PollFormData;
      };
    };

function reducer(state: UncommittedPoll[], action: Action): UncommittedPoll[] {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "remove":
      return state.filter((_, idx) => idx !== action.payload);
    case "update":
      if (state[action.payload.idx]) {
        return state.with(action.payload.idx, {
          ...state[action.payload.idx],
          data: action.payload.data,
          lastSaved: Date.now(),
        });
      }

      if (state.length === 0) {
        return [
          {
            id: "uncommitted",
            data: action.payload.data,
            lastSaved: Date.now(),
          },
        ];
      }

      return state;
  }
}

function getUncommittedPolls(polls: UncommittedPoll[]): UncommittedPoll[] {
  const now = Date.now();
  const weekInMs = 7 * 24 * 60 * 60 * 1000;

  const cleanedPolls = polls.reduce((acc, poll) => {
    if (now - poll.lastSaved > weekInMs) {
      return acc;
    }
    acc.push(poll);
    return acc;
  }, [] as UncommittedPoll[]);

  return cleanedPolls;
}

function isUncommittedPollArray(polls: unknown): polls is UncommittedPoll[] {
  return Array.isArray(polls) && polls.every(isUncommittedPoll);
}

function isUncommittedPoll(poll: unknown): poll is UncommittedPoll {
  return (
    typeof poll === "object" &&
    poll !== null &&
    "id" in poll &&
    "data" in poll &&
    "lastSaved" in poll
  );
}
