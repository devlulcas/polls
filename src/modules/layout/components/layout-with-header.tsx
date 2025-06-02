import Navbar from "@/modules/layout/components/navbar";

type LayoutWithHeaderProps = {
  children: React.ReactNode;
};

export async function LayoutWithHeader({ children }: LayoutWithHeaderProps) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-3 pt-3 min-h-[var(--h-safe)]">
        {children}
      </main>
    </>
  );
}
