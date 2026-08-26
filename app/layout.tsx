import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse Analytics",
  description:
    "See visits, popular pages, devices, and referrers for your websites.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { if (localStorage.getItem("pulse-theme") === "dark") document.documentElement.classList.add("dark"); } catch (_) {}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
