"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-[13px] text-muted transition-colors hover:text-ink"
    >
      Log out
    </button>
  );
}
