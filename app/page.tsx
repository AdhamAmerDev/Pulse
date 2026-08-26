import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <div className="mx-auto flex max-w-5xl flex-col px-5 py-6 sm:px-6">
        <header className="flex items-center justify-between border-b-[0.5px] border-border pb-4">
          <span className="font-mono text-[15px] font-medium tracking-[0.5px]">
            PULSE
          </span>
          <nav className="flex items-center gap-4 text-[13px] text-muted">
            <Link href="/dashboard" className="hover:text-ink">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-ink">
              Login
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 items-center py-16">
          <div className="max-w-xl">
            <h1 className="text-5xl font-medium tracking-[-0.08em] text-ink sm:text-6xl">
              Pulse
            </h1>
            <p className="mt-4 text-[15px] text-muted">
              Understand how people use your website.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-xl bg-pulse px-4 py-2 text-[13px] font-medium text-paper"
            >
              Go to dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
