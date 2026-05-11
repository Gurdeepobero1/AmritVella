"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] bg-card px-3 py-2 text-sm font-bold text-navy-950"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
