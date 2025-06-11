"use server";

import { revalidatePath } from "next/cache";
import type { PollFormData } from "../lib/schemas";
import { fail, ok, Result } from "@/lib/result";

// Mock database operations - replace with actual database calls
type CreatePollState = Result<string> | null;

export async function createPoll(
  _: CreatePollState,
  data: PollFormData
): Promise<CreatePollState> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Creating poll with data:", JSON.stringify(data, null, 2));
    const pollId = "mock-poll-id-" + Date.now();
    savePoll(data, "create");
    revalidatePath("/");
    revalidatePath("/dashboard/*");
    revalidatePath("/polls/" + pollId);
    return ok(pollId);
  } catch (error) {
    console.error("Error creating poll:", error);
    return fail("Failed to create poll");
  }
}

export async function savePollDraft(
  _: CreatePollState,
  data: PollFormData
): Promise<CreatePollState> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Saving poll draft:", JSON.stringify(data, null, 2));
    const pollId = "mock-draft-id-" + Date.now();
    savePoll(data, "draft");
    revalidatePath("/");
    revalidatePath("/dashboard/*");
    revalidatePath("/polls/" + pollId);
    return ok(pollId);
  } catch (error) {
    console.error("Error creating poll draft:", error);
    return fail("Failed to create poll draft");
  }
}

async function savePoll(
  data: PollFormData,
  mode: "create" | "draft"
): Promise<Result<string>> {
  return ok("mock-poll-id-" + Date.now());
}
