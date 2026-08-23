function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getSiteId() {
  const script = document.currentScript;
  return script?.getAttribute("data-site");
}

const eventData = {
  type: "page_view",
  url: window.location.href,
  referrer: document.referrer || "direct",
  device: getDeviceType(),
  siteId: getSiteId(),
  timestamp: Date.now(),
};

fetch("/api/event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(eventData),
});
