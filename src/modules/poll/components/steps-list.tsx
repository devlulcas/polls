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
import type { StepFormData } from "../lib/schemas";
import { StepItem } from "./step-item";

interface StepsListProps {
  steps: StepFormData[];
  onUpdate: (steps: StepFormData[]) => void;
}

export function StepsList({ steps, onUpdate }: StepsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = steps.findIndex(
        (item) => (item.id || `step-${steps.indexOf(item)}`) === active.id
      );
      const newIndex = steps.findIndex(
        (item) => (item.id || `step-${steps.indexOf(item)}`) === over?.id
      );

      const newSteps = arrayMove(steps, oldIndex, newIndex).map(
        (step, index) => ({
          ...step,
          stepOrder: index,
        })
      );

      onUpdate(newSteps);
    }
  };

  const updateStep = (index: number, step: StepFormData) => {
    const newSteps = [...steps];
    newSteps[index] = step;
    onUpdate(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({
        ...step,
        stepOrder: i,
      }));
    onUpdate(newSteps);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={steps.map((step, index) => step.id || `step-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-6">
          {steps.map((step, index) => (
            <StepItem
              key={step.id || `step-${index}`}
              step={step}
              index={index}
              onUpdate={updateStep}
              onRemove={removeStep}
              canRemove={steps.length > 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
