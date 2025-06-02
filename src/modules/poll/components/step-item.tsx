"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { StepFormData, QuestionFormData } from "../lib/schemas";
import { QuestionsList } from "./questions-list";
import { useTranslations } from "next-intl";

interface StepItemProps {
  step: StepFormData;
  index: number;
  onUpdate: (index: number, step: StepFormData) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function StepItem({
  step,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: StepItemProps) {
  const t = useTranslations("poll.create");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: step.id || `step-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleQuestionsUpdate = (questions: QuestionFormData[]) => {
    onUpdate(index, { ...step, questions });
  };

  const addQuestion = () => {
    const newQuestion: QuestionFormData = {
      questionText: "",
      questionOrder: step.questions.length,
      questionType: "radio",
      isRequired: false,
      allowOther: false,
      options: [
        { optionText: "", optionOrder: 0, isOther: false },
        { optionText: "", optionOrder: 1, isOther: false },
      ],
    };
    handleQuestionsUpdate([...step.questions, newQuestion]);
  };

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardHeader>
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 mt-1"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <CardTitle className="text-lg">Step {index + 1}</CardTitle>
          </div>

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
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor={`step-title-${index}`}>{t("stepTitle")}</Label>
            <Input
              id={`step-title-${index}`}
              value={step.title}
              onChange={(e) =>
                onUpdate(index, { ...step, title: e.target.value })
              }
              placeholder={t("stepTitlePlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor={`step-description-${index}`}>
              {t("stepDescription")}
            </Label>
            <Textarea
              id={`step-description-${index}`}
              value={step.description || ""}
              onChange={(e) =>
                onUpdate(index, { ...step, description: e.target.value })
              }
              placeholder={t("stepDescriptionPlaceholder")}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`step-required-${index}`}
              checked={step.isRequired}
              onCheckedChange={(checked) =>
                onUpdate(index, { ...step, isRequired: checked })
              }
            />
            <Label htmlFor={`step-required-${index}`}>
              {t("stepRequired")}
            </Label>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{t("questions")}</Label>
            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" />
              {t("addQuestion")}
            </Button>
          </div>

          <QuestionsList
            questions={step.questions}
            onUpdate={handleQuestionsUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
