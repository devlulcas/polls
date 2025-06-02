"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OptionFormData } from "../lib/schemas";
import { useTranslations } from "next-intl";

interface OptionItemProps {
  option: OptionFormData;
  index: number;
  onUpdate: (index: number, option: OptionFormData) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function OptionItem({
  option,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: OptionItemProps) {
  const t = useTranslations("poll.create");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: option.id || `option-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded-md bg-background"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <Input
        value={option.optionText}
        onChange={(e) =>
          onUpdate(index, { ...option, optionText: e.target.value })
        }
        placeholder={t("optionTextPlaceholder")}
        className="flex-1"
      />

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
