import { getUserOnServer } from "@/modules/auth/lib/get-user-on-server";
import { assertLoggedInServer } from "@/modules/auth/lib/assert-logged-in";
import { LayoutWithHeader } from "@/modules/layout/components/layout-with-header";
import { CreatePollForm } from "@/modules/poll/components/create-poll-form";

export default async function DashboardPage() {
  const { data } = await getUserOnServer();
  assertLoggedInServer(data);

  return (
    <LayoutWithHeader>
      <CreatePollForm />
    </LayoutWithHeader>
  );
}
