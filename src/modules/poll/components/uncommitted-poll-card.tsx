"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkullIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  UncommittedPoll,
  useAutoSaveContext,
} from "../contexts/polls-autosave-context";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

type UncommittedPollCardProps = {
  poll: UncommittedPoll;
  idx: number;
};

export function UncommittedPollCard({ poll, idx }: UncommittedPollCardProps) {
  const hoursLeft = Math.floor(
    7 * 24 - (Date.now() - poll.lastSaved) / (1000 * 60 * 60)
  );

  const showWarning = hoursLeft <= 24;

  const t = useTranslations("poll.create");

  const { dispatch } = useAutoSaveContext();

  return (
    <motion.div variants={item}>
      <Card className="relative">
        <UncommittedPollCardWarning lastSaved={poll.lastSaved} />
        <CardHeader>
          <CardTitle className="text-lg">{poll.data.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {poll.data.description || t("noDescription")}
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            {t("lastSaved")}: {new Date(poll.lastSaved).toLocaleString()}
          </p>

          <Button
            onClick={() => dispatch({ type: "remove", payload: idx })}
            variant="destructive"
          >
            {t("remove")}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UncommittedPollCardWarning({ lastSaved }: { lastSaved: number }) {
  const hoursLeft = Math.floor(
    7 * 24 - (Date.now() - lastSaved) / (1000 * 60 * 60)
  );

  const showWarning = hoursLeft <= 24;

  const t = useTranslations("poll.create");

  if (!showWarning) return null;

  return (
    <div
      style={{
        ["--w" as string]: "30px",
        ["--cw" as string]: "calc(var(--w) / 2)",
        ["--h" as string]: "40px",
        ["--sh" as string]: "6px",
        ["--r" as string]: "calc(var(--sh) + 1rem)",
      }}
      className="absolute top-0 right-[var(--r)]"
    >
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative w-[var(--w)] h-[var(--h)] bg-linear-to-b from-special-3 to-destructive -top-[var(--sh)] left-0",
              "before:absolute before:right-[-6px] before:w-0 before:h-0 before:border-b-(length:--sh) before:border-b-special-6 before:border-r-(length:--sh) before:border-r-transparent before:content-['']",
              "after:absolute after:-bottom-[var(--cw)] after:w-0 after:h-0 after:border-l-(length:--cw) after:border-destructive after:border-r-(length:--cw) after:border-r-special-bg-destructive after:border-b-(length:--cw) after:border-b-transparent after:content-['']"
            )}
          >
            <SkullIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {t("uncommittedPollWarning", { hours: hoursLeft })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
