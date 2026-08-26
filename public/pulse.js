function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getSiteId() {
  return document.currentScript?.getAttribute("data-site");
}

function getIngestKey() {
  return document.currentScript?.getAttribute("data-key");
}

function getSafeReferrer() {
  if (!document.referrer) return "direct";
  try {
    const referrer = new URL(document.referrer);
    return `${referrer.origin}${referrer.pathname}`.slice(0, 2048);
  } catch {
    return "direct";
  }
}

function shouldTrackPageView(siteId) {
  const key = `pulse:page-view:${siteId}:${window.location.pathname}`;
  const now = Date.now();

  try {
    const lastTracked = Number(sessionStorage.getItem(key));
    if (lastTracked && now - lastTracked < 30 * 1000) return false;
    sessionStorage.setItem(key, String(now));
  } catch {
    return true;
  }

  return true;
}

const siteId = getSiteId();
const ingestKey = getIngestKey();

if (siteId && ingestKey && shouldTrackPageView(siteId)) {
  const pageUrl = new URL(window.location.href);
  const eventData = {
    type: "page_view",
    url: `${pageUrl.origin}${pageUrl.pathname}`.slice(0, 2048),
    referrer: getSafeReferrer(),
    device: getDeviceType(),
    siteId,
    ingestKey,
  };

  const scriptUrl = document.currentScript?.src;
  const apiUrl = scriptUrl
    ? new URL("/api/event", scriptUrl).toString()
    : "/api/event";

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
}
