"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { QuestionFormData, OptionFormData } from "../lib/schemas";
import { OptionsList } from "./options-list";
import { useTranslations } from "next-intl";

interface QuestionItemProps {
  question: QuestionFormData;
  index: number;
  onUpdate: (index: number, question: QuestionFormData) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function QuestionItem({
  question,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: QuestionItemProps) {
  const t = useTranslations("poll.create");
  const tTypes = useTranslations("poll.questionTypes");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id || `question-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const needsOptions = ["checkbox", "radio", "ranking"].includes(
    question.questionType
  );

  const handleOptionsUpdate = (options: OptionFormData[]) => {
    onUpdate(index, { ...question, options });
  };

  const addOption = () => {
    const newOption: OptionFormData = {
      optionText: "",
      optionOrder: question.options.length,
      isOther: false,
    };
    handleOptionsUpdate([...question.options, newOption]);
  };

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 mt-1"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <Label htmlFor={`question-${index}`}>{t("questionText")}</Label>
              <Input
                id={`question-${index}`}
                value={question.questionText}
                onChange={(e) =>
                  onUpdate(index, { ...question, questionText: e.target.value })
                }
                placeholder={t("questionTextPlaceholder")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("questionType")}</Label>
                <Select
                  value={question.questionType}
                  onValueChange={(value: any) =>
                    onUpdate(index, { ...question, questionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkbox">
                      {tTypes("checkbox")}
                    </SelectItem>
                    <SelectItem value="radio">{tTypes("radio")}</SelectItem>
                    <SelectItem value="text">{tTypes("text")}</SelectItem>
                    <SelectItem value="textarea">
                      {tTypes("textarea")}
                    </SelectItem>
                    <SelectItem value="rating">{tTypes("rating")}</SelectItem>
                    <SelectItem value="ranking">{tTypes("ranking")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`required-${index}`}
                    checked={question.isRequired}
                    onCheckedChange={(checked) =>
                      onUpdate(index, { ...question, isRequired: checked })
                    }
                  />
                  <Label htmlFor={`required-${index}`}>
                    {t("questionRequired")}
                  </Label>
                </div>

                {needsOptions && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`other-${index}`}
                      checked={question.allowOther}
                      onCheckedChange={(checked) =>
                        onUpdate(index, { ...question, allowOther: checked })
                      }
                    />
                    <Label htmlFor={`other-${index}`}>{t("allowOther")}</Label>
                  </div>
                )}
              </div>
            </div>

            {question.questionType === "checkbox" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`min-${index}`}>{t("minSelections")}</Label>
                  <Input
                    id={`min-${index}`}
                    type="number"
                    min="0"
                    value={question.minSelections || ""}
                    onChange={(e) =>
                      onUpdate(index, {
                        ...question,
                        minSelections: e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`max-${index}`}>{t("maxSelections")}</Label>
                  <Input
                    id={`max-${index}`}
                    type="number"
                    min="1"
                    value={question.maxSelections || ""}
                    onChange={(e) =>
                      onUpdate(index, {
                        ...question,
                        maxSelections: e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>
            )}
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

      {needsOptions && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("options")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("addOption")}
              </Button>
            </div>

            <OptionsList
              options={question.options}
              onUpdate={handleOptionsUpdate}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
