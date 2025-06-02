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
import type { OptionFormData } from "../lib/schemas";
import { OptionItem } from "./option-item";

interface OptionsListProps {
  options: OptionFormData[];
  onUpdate: (options: OptionFormData[]) => void;
}

export function OptionsList({ options, onUpdate }: OptionsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = options.findIndex(
        (item) => (item.id || `option-${options.indexOf(item)}`) === active.id
      );
      const newIndex = options.findIndex(
        (item) => (item.id || `option-${options.indexOf(item)}`) === over?.id
      );

      const newOptions = arrayMove(options, oldIndex, newIndex).map(
        (option, index) => ({
          ...option,
          optionOrder: index,
        })
      );

      onUpdate(newOptions);
    }
  };

  const updateOption = (index: number, option: OptionFormData) => {
    const newOptions = [...options];
    newOptions[index] = option;
    onUpdate(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options
      .filter((_, i) => i !== index)
      .map((option, i) => ({
        ...option,
        optionOrder: i,
      }));
    onUpdate(newOptions);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={options.map((option, index) => option.id || `option-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {options.map((option, index) => (
            <OptionItem
              key={option.id || `option-${index}`}
              option={option}
              index={index}
              onUpdate={updateOption}
              onRemove={removeOption}
              canRemove={options.length > 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
