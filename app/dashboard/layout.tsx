import { auth } from "../../auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import PageMotion from "@/components/PageMotion";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <DashboardNav />
      <PageMotion>{children}</PageMotion>
    </div>
  );
}
