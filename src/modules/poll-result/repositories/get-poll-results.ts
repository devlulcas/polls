import { db } from "@/modules/database/lib/db";
import {
  options,
  pollSteps,
  questions,
  responses,
} from "@/modules/database/lib/schema";
import { eq } from "drizzle-orm";

export async function getPollResults(pollId: string) {
  return db
    .select({
      questionId: questions.id,
      questionText: questions.questionText,
      stepId: pollSteps.id,
      stepTitle: pollSteps.title,
      stepOrder: pollSteps.stepOrder,
      optionId: options.id,
      optionText: options.optionText,
      responseCount: db.$count(responses.id),
    })
    .from(questions)
    .innerJoin(pollSteps, eq(questions.stepId, pollSteps.id))
    .innerJoin(options, eq(options.questionId, questions.id))
    .leftJoin(responses, eq(responses.optionId, options.id))
    .where(eq(pollSteps.pollId, pollId))
    .groupBy(
      questions.id,
      questions.questionText,
      pollSteps.id,
      pollSteps.title,
      pollSteps.stepOrder,
      options.id,
      options.optionText
    )
    .orderBy(pollSteps.stepOrder, questions.questionOrder, options.optionOrder);
}
