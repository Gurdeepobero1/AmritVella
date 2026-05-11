import { AppShell } from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShell userName="Direct access">{children}</AppShell>;
}
