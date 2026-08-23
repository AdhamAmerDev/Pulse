import Script from "next/script";

export default function TestSite() {
  return (
    <div>
      <h1>Some Random Website</h1>
      <p>This page has Pulse's tracking script installed.</p>
      <Script
        src="/pulse.js"
        data-site="b5d8bfb0-5f6f-4f30-91ef-4051b8ad5169"
      />
    </div>
  );
}
