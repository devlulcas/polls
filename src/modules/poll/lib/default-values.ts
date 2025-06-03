import {
  OptionFormData,
  PollFormData,
  QuestionFormData,
  StepFormData,
} from "../lib/schemas";

export const POLL_OPTION_DEFAULT_VALUES: OptionFormData = {
  optionText: "",
  optionOrder: 0,
  isOther: false,
};

export const POLL_QUESTION_DEFAULT_VALUES: QuestionFormData = {
  questionText: "",
  questionOrder: 0,
  questionType: "radio",
  isRequired: false,
  allowOther: false,
  options: [POLL_OPTION_DEFAULT_VALUES],
};

export const POLL_STEP_DEFAULT_VALUES: StepFormData = {
  title: "",
  description: "",
  stepOrder: 0,
  isRequired: true,
  questions: [POLL_QUESTION_DEFAULT_VALUES],
};

export const POLL_FORM_DEFAULT_VALUES: PollFormData = {
  title: "",
  description: "",
  isPublic: false,
  allowAnonymous: true,
  steps: [POLL_STEP_DEFAULT_VALUES],
};
