"use client";

import Link from "next/link";
import { Moon, Settings, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import LogoutButton from "@/components/LogoutButton";

const themeChangedEvent = "pulse-theme-change";

function subscribeToTheme(callback: () => void) {
  window.addEventListener(themeChangedEvent, callback);
  return () => window.removeEventListener(themeChangedEvent, callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export default function DashboardNav() {
  const dark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("pulse-theme");
    const shouldUseDark = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", shouldUseDark);
    window.dispatchEvent(new Event(themeChangedEvent));
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("pulse-theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event(themeChangedEvent));
  }

  return (
    <header className="flex items-center justify-between border-b-[0.5px] border-border px-5 py-3.5">
      <Link
        href="/dashboard"
        className="font-mono text-[15px] font-medium tracking-[0.5px]"
      >
        PULSE
      </Link>

      <nav className="flex items-center gap-3 text-[13px] text-muted">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Use light mode" : "Use dark mode"}
          title={dark ? "Use light mode" : "Use dark mode"}
          className="p-1.5 hover:text-ink"
        >
          {dark ? (
            <Sun size={16} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Moon size={16} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
        <Link
          href="/dashboard/settings"
          aria-label="Settings"
          title="Settings"
          className="p-1.5 hover:text-ink"
        >
          <Settings size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <LogoutButton />
      </nav>
    </header>
  );
}
