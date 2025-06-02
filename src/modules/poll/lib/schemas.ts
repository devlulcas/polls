import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  polls,
  pollSteps,
  questions,
  options,
} from "../../database/lib/schema";

// Generate base schemas from Drizzle
export const pollInsertSchema = createInsertSchema(polls, {
  title: (schema) =>
    schema.min(1, "Title is required").max(200, "Title too long"),
  description: (schema) => schema.max(1000, "Description too long").optional(),
  maxResponses: (schema) => schema.min(1, "Must be at least 1").optional(),
});

export const pollStepInsertSchema = createInsertSchema(pollSteps, {
  title: (schema) =>
    schema.min(1, "Step title is required").max(200, "Title too long"),
  description: (schema) => schema.max(500, "Description too long").optional(),
  stepOrder: (schema) => schema.min(0, "Order must be non-negative"),
});

export const questionInsertSchema = createInsertSchema(questions, {
  questionText: (schema) =>
    schema.min(1, "Question text is required").max(500, "Question too long"),
  questionOrder: (schema) => schema.min(0, "Order must be non-negative"),
  maxSelections: (schema) => schema.min(1, "Must be at least 1").optional(),
  minSelections: (schema) => schema.min(0, "Must be non-negative").optional(),
});

export const optionInsertSchema = createInsertSchema(options, {
  optionText: (schema) =>
    schema.min(1, "Option text is required").max(200, "Option too long"),
  optionOrder: (schema) => schema.min(0, "Order must be non-negative"),
});

// Form schemas for the UI
export const optionFormSchema = z.object({
  id: z.string().optional(),
  optionText: z
    .string()
    .min(1, "Option text is required")
    .max(200, "Option too long"),
  optionOrder: z.number().min(0),
  isOther: z.boolean().default(false),
});

export const questionFormSchema = z.object({
  id: z.string().optional(),
  questionText: z
    .string()
    .min(1, "Question text is required")
    .max(500, "Question too long"),
  questionOrder: z.number().min(0),
  questionType: z.enum([
    "checkbox",
    "radio",
    "text",
    "textarea",
    "rating",
    "ranking",
  ]),
  isRequired: z.boolean().default(false),
  allowOther: z.boolean().default(false),
  maxSelections: z.number().min(1).optional(),
  minSelections: z.number().min(0).optional(),
  options: z.array(optionFormSchema).default([]),
});

export const stepFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Step title is required").max(200, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  stepOrder: z.number().min(0),
  isRequired: z.boolean().default(true),
  questions: z.array(questionFormSchema).default([]),
});

export const pollFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  isPublic: z.boolean().default(false),
  allowAnonymous: z.boolean().default(true),
  maxResponses: z.number().min(1).optional(),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  steps: z.array(stepFormSchema).min(1, "At least one step is required"),
});

export type PollFormData = z.infer<typeof pollFormSchema>;
export type StepFormData = z.infer<typeof stepFormSchema>;
export type QuestionFormData = z.infer<typeof questionFormSchema>;
export type OptionFormData = z.infer<typeof optionFormSchema>;
