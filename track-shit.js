(function () {
  const siteId = document.currentScript.getAttribute("data-site-id");
  const payload = {
    siteId,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  fetch("http://127.0.0.1:8000/api/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {
    // fail silently if server unavailable
  });
})();
