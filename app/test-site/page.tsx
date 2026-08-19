import Script from "next/script";

export default function TestSite() {
  return (
    <div>
      <h1>Some Random Website</h1>
      <p>This page has Pulse's tracking script installed.</p>
      <Script src="/pulse.js" />
    </div>
  );
}
