"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { QuestionFormData } from "../lib/schemas";
import { QuestionItem } from "./question-item";

interface QuestionsListProps {
  questions: QuestionFormData[];
  onUpdate: (questions: QuestionFormData[]) => void;
}

export function QuestionsList({ questions, onUpdate }: QuestionsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex(
        (item) =>
          (item.id || `question-${questions.indexOf(item)}`) === active.id
      );
      const newIndex = questions.findIndex(
        (item) =>
          (item.id || `question-${questions.indexOf(item)}`) === over?.id
      );

      const newQuestions = arrayMove(questions, oldIndex, newIndex).map(
        (question, index) => ({
          ...question,
          questionOrder: index,
        })
      );

      onUpdate(newQuestions);
    }
  };

  const updateQuestion = (index: number, question: QuestionFormData) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    onUpdate(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions
      .filter((_, i) => i !== index)
      .map((question, i) => ({
        ...question,
        questionOrder: i,
      }));
    onUpdate(newQuestions);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map(
          (question, index) => question.id || `question-${index}`
        )}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id || `question-${index}`}
              question={question}
              index={index}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
              canRemove={questions.length > 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
