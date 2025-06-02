"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  pollFormSchema,
  type PollFormData,
  type StepFormData,
} from "../lib/schemas";
import { createPoll, savePollDraft } from "../actions/poll-actions";
import { pollQueryOptions } from "../lib/query-options";
import { StepsList } from "./steps-list";
import { cn } from "@/lib/utils";

export function CreatePollForm() {
  const t = useTranslations("poll.create");
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PollFormData>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
      allowAnonymous: true,
      steps: [
        {
          title: "",
          description: "",
          stepOrder: 0,
          isRequired: true,
          questions: [
            {
              questionText: "",
              questionOrder: 0,
              questionType: "radio",
              isRequired: false,
              allowOther: false,
              options: [
                { optionText: "", optionOrder: 0, isOther: false },
                { optionText: "", optionOrder: 1, isOther: false },
              ],
            },
          ],
        },
      ],
    },
  });

  const createPollMutation = useMutation({
    mutationFn: createPoll,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Poll created successfully!");
        queryClient.invalidateQueries({ queryKey: pollQueryOptions.all() });
        form.reset();
      } else {
        toast.error(result.error || "Failed to create poll");
      }
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: savePollDraft,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Draft saved successfully!");
        queryClient.invalidateQueries({ queryKey: pollQueryOptions.all() });
      } else {
        toast.error(result.error || "Failed to save draft");
      }
    },
  });

  const onSubmit = (data: PollFormData) => {
    startTransition(() => {
      createPollMutation.mutate(data);
    });
  };

  const onSaveDraft = () => {
    const data = form.getValues();
    startTransition(() => {
      saveDraftMutation.mutate(data);
    });
  };

  const addStep = () => {
    const currentSteps = form.getValues("steps");
    const newStep: StepFormData = {
      title: "",
      description: "",
      stepOrder: currentSteps.length,
      isRequired: true,
      questions: [
        {
          questionText: "",
          questionOrder: 0,
          questionType: "radio",
          isRequired: false,
          allowOther: false,
          options: [
            { optionText: "", optionOrder: 0, isOther: false },
            { optionText: "", optionOrder: 1, isOther: false },
          ],
        },
      ],
    };
    form.setValue("steps", [...currentSteps, newStep]);
  };

  const updateSteps = (steps: StepFormData[]) => {
    form.setValue("steps", steps);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          Create a comprehensive poll with multiple steps and question types
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pollTitle")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("pollTitlePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pollDescription")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("pollDescriptionPlaceholder")}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Poll Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t("isPublic")}</FormLabel>
                        <FormDescription>
                          Public polls can be discovered by anyone
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t("allowAnonymous")}</FormLabel>
                        <FormDescription>
                          Allow users to respond without signing in
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="maxResponses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("maxResponses")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder={t("maxResponsesPlaceholder")}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("startsAt")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("endsAt")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Poll Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("steps")}</CardTitle>
                  <CardDescription>
                    Organize your poll into multiple steps for better user
                    experience
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addStep}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t("addStep")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <StepsList steps={form.watch("steps")} onUpdate={updateSteps} />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isPending}
            >
              {t("saveDraft")}
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="ghost">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t("publish")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
