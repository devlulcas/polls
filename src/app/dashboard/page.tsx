import { getUserOnServer } from "@/modules/auth/lib/get-user-on-server";
import { assertLoggedInServer } from "@/modules/auth/lib/assert-logged-in";
import { LayoutWithHeader } from "@/modules/layout/components/layout-with-header";

export default async function DashboardPage() {
  const { data } = await getUserOnServer();
  assertLoggedInServer(data);

  return (
    <LayoutWithHeader>
      <pre>{JSON.stringify(data.user, null, 2)}</pre>
    </LayoutWithHeader>
  );
}
