"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-steel-100 transition hover:border-saffron-500/60 hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
