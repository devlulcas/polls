import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  unique,
  boolean,
  pgEnum,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

// Enums for better type safety
export const questionTypeEnum = pgEnum("question_type", [
  "checkbox",
  "radio",
  "text",
  "textarea",
  "rating",
  "ranking",
]);

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "active",
  "paused",
  "closed",
]);

// Profiles table (maps to Supabase Auth)
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().notNull(), // references auth.users
    email: text("email").notNull().unique(),
    username: text("username").unique(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("profiles_email_idx").on(table.email),
    index("profiles_username_idx").on(table.username),
  ]
);

export type Profile = InferSelectModel<typeof profiles>;

// Polls table
export const polls = pgTable(
  "polls",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    creatorId: uuid("creator_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    status: pollStatusEnum("status").default("draft").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    allowAnonymous: boolean("allow_anonymous").default(true).notNull(),
    maxResponses: integer("max_responses"), // null = unlimited
    responseCount: integer("response_count").default(0).notNull(),
    settings: jsonb("settings"), // For flexible poll settings
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("polls_creator_idx").on(table.creatorId),
    index("polls_status_idx").on(table.status),
    index("polls_public_idx").on(table.isPublic),
  ]
);

// Poll steps table
export const pollSteps = pgTable(
  "poll_steps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id")
      .references(() => polls.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    stepOrder: integer("step_order").notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("poll_steps_poll_order_idx").on(table.pollId, table.stepOrder),
    unique("poll_step_order_unique").on(table.pollId, table.stepOrder),
  ]
);

// Questions table
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    stepId: uuid("step_id")
      .references(() => pollSteps.id, { onDelete: "cascade" })
      .notNull(),
    questionText: text("question_text").notNull(),
    questionOrder: integer("question_order").notNull(),
    questionType: questionTypeEnum("question_type")
      .notNull()
      .default("checkbox"),
    isRequired: boolean("is_required").default(false).notNull(),
    allowOther: boolean("allow_other").default(false).notNull(),
    maxSelections: integer("max_selections"), // For checkbox questions
    minSelections: integer("min_selections"), // For checkbox questions
    settings: jsonb("settings"), // For question-specific settings (rating scale, etc.)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("questions_step_order_idx").on(table.stepId, table.questionOrder),
    unique("step_question_order_unique").on(table.stepId, table.questionOrder),
  ]
);

// Options table
export const options = pgTable(
  "options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    questionId: uuid("question_id")
      .references(() => questions.id, { onDelete: "cascade" })
      .notNull(),
    optionText: text("option_text").notNull(),
    optionOrder: integer("option_order").notNull(),
    isOther: boolean("is_other").default(false).notNull(), // For "Other" options
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("options_question_order_idx").on(table.questionId, table.optionOrder),
    unique("question_option_order_unique").on(
      table.questionId,
      table.optionOrder
    ),
  ]
);

// Invites table
export const invites = pgTable(
  "invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id")
      .references(() => polls.id, { onDelete: "cascade" })
      .notNull(),
    code: text("code").notNull(),
    name: text("name"), // Optional name for the invite
    usageLimit: integer("usage_limit").default(1).notNull(),
    usageCount: integer("usage_count").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [
    unique("invite_code_unique").on(table.code),
    index("invites_poll_idx").on(table.pollId),
    index("invites_code_idx").on(table.code),
  ]
);

// Respondents table
export const respondents = pgTable(
  "respondents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inviteId: uuid("invite_id")
      .references(() => invites.id, { onDelete: "cascade" })
      .notNull(),
    pollId: uuid("poll_id")
      .references(() => polls.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name"),
    email: text("email"), // Optional email for follow-ups
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    isAnonymous: boolean("is_anonymous").default(true).notNull(),
    ipAddress: text("ip_address"), // For duplicate prevention
    userAgent: text("user_agent"), // For analytics/duplicate prevention
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("respondents_poll_idx").on(table.pollId),
    index("respondents_invite_idx").on(table.inviteId),
    index("respondents_profile_idx").on(table.profileId),
    index("respondents_completed_idx").on(table.completedAt),
  ]
);

// Responses table
export const responses = pgTable(
  "responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    respondentId: uuid("respondent_id")
      .references(() => respondents.id, { onDelete: "cascade" })
      .notNull(),
    questionId: uuid("question_id")
      .references(() => questions.id, { onDelete: "cascade" })
      .notNull(),
    optionId: uuid("option_id").references(() => options.id, {
      onDelete: "cascade",
    }),
    // optionId can be null for text/textarea responses
    textResponse: text("text_response"), // For text/textarea questions or "Other" responses
    numericResponse: integer("numeric_response"), // For rating questions
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("responses_respondent_idx").on(table.respondentId),
    index("responses_question_idx").on(table.questionId),
    index("responses_option_idx").on(table.optionId),
    // Ensure one response per question per respondent for radio questions
    unique("respondent_question_unique").on(
      table.respondentId,
      table.questionId
    ),
  ]
);

// Define relations (same as before with minor updates)
export const profilesRelations = relations(profiles, ({ many }) => ({
  polls: many(polls),
  respondents: many(respondents),
}));

export const pollsRelations = relations(polls, ({ one, many }) => ({
  creator: one(profiles, {
    fields: [polls.creatorId],
    references: [profiles.id],
  }),
  steps: many(pollSteps),
  invites: many(invites),
  respondents: many(respondents),
}));

export const pollStepsRelations = relations(pollSteps, ({ one, many }) => ({
  poll: one(polls, {
    fields: [pollSteps.pollId],
    references: [polls.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  step: one(pollSteps, {
    fields: [questions.stepId],
    references: [pollSteps.id],
  }),
  options: many(options),
  responses: many(responses),
}));

export const optionsRelations = relations(options, ({ one, many }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
  responses: many(responses),
}));

export const invitesRelations = relations(invites, ({ one, many }) => ({
  poll: one(polls, {
    fields: [invites.pollId],
    references: [polls.id],
  }),
  respondents: many(respondents),
}));

export const respondentsRelations = relations(respondents, ({ one, many }) => ({
  invite: one(invites, {
    fields: [respondents.inviteId],
    references: [invites.id],
  }),
  poll: one(polls, {
    fields: [respondents.pollId],
    references: [polls.id],
  }),
  profile: one(profiles, {
    fields: [respondents.profileId],
    references: [profiles.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  respondent: one(respondents, {
    fields: [responses.respondentId],
    references: [respondents.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
  option: one(options, {
    fields: [responses.optionId],
    references: [options.id],
  }),
}));
