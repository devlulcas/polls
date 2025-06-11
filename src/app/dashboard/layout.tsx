import { UncommittedPollCard } from "@/modules/poll/components/uncommitted-poll-card";
import { PollsAutosaveProvider } from "@/modules/poll/contexts/polls-autosave-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PollsAutosaveProvider>{children}</PollsAutosaveProvider>;
}
