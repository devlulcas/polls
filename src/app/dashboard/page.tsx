import { getUserOnServer } from "@/modules/auth/lib/get-user-on-server";
import { assertLoggedInServer } from "@/modules/auth/lib/assert-logged-in";
import { LayoutWithHeader } from "@/modules/layout/components/layout-with-header";
import { UncommittedPollsGrid } from "@/modules/poll/components/uncommitted-polls-grid";

export default async function DashboardPage() {
  const { data } = await getUserOnServer();
  assertLoggedInServer(data, { targetPath: "/dashboard" });

  return (
    <LayoutWithHeader>
      <UncommittedPollsGrid />
    </LayoutWithHeader>
  );
}
