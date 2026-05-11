"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inputClass } from "@/components/ui/primitives";

export function LoginForm({ registered = false }: { registered?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await signIn("credentials", {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            redirect: false
          });

          if (result?.ok) {
            router.push("/dashboard");
            router.refresh();
          } else {
            setError("Invalid email or password.");
          }
        });
      }}
    >
      {registered ? (
        <div className="rounded-[12px] border border-green-700/25 bg-green-50 px-3 py-2 text-sm text-green-800">
          Account created. Sign in to continue.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[12px] border border-red-700/25 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      ) : null}
      <label className="block">
        <span className="text-sm font-medium text-navy-950">Email</span>
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-navy-950">Password</span>
        <input className={inputClass} name="password" type="password" autoComplete="current-password" required />
      </label>
      <button
        className="focus-ring w-full rounded-[8px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white transition disabled:opacity-60"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-xs leading-5 text-steel-700">
        Seed account after setup: demo@amritvella.local / amritvella123
      </p>
    </form>
  );
}
