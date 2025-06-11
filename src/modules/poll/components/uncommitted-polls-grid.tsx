"use client";

import { motion } from "motion/react";
import { useAutoSaveContext } from "../contexts/polls-autosave-context";
import { UncommittedPollCard } from "./uncommitted-poll-card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function UncommittedPollsGrid() {
  const { polls } = useAutoSaveContext();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
    >
      {polls.map((poll, idx) => (
        <UncommittedPollCard key={idx} idx={idx} poll={poll} />
      ))}
    </motion.div>
  );
}
