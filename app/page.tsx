import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Pulse</h1>
      <p>Simple, self-hosted analytics.</p>
      <Link href="/dashboard">Go to dashboard</Link>
    </div>
  );
}
