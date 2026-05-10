import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { LoginForm } from "@/components/login-form";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { registered?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="border-b border-navy-950/10 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron-600">AmritVella</div>
          <h1 className="mt-3 text-2xl font-semibold text-navy-950">Private discipline command center</h1>
          <p className="mt-2 text-sm leading-6 text-steel-700">
            Track Naam, career execution, emotional control, fitness, seva, and long-term history.
          </p>
        </div>
        <div className="p-6">
          <LoginForm registered={searchParams?.registered === "1"} />
          <Link className="focus-ring mt-5 block rounded-md text-center text-sm font-medium text-navy-950 underline" href="/register">
            Create first account
          </Link>
        </div>
      </Card>
    </main>
  );
}
