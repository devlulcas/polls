import { Button } from "@/components/ui/button";
import { getUserOnServer } from "@/modules/auth/lib/get-user-on-server";
import { LayoutWithHeader } from "@/modules/layout/components/layout-with-header";

export default async function DashboardPage() {
  const user = await getUserOnServer();

  return (
    <LayoutWithHeader>
      <div className="flex gap-2">
        <Button variant="default">default</Button>
        <Button variant="primary">primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="outline">outline</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="discord">discord</Button>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </LayoutWithHeader>
  );
}
