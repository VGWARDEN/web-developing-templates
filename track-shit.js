// track.js (served from your analytics server)
(function () {
  const siteId = document.currentScript.getAttribute('data-site-id');
  const payload = {
    siteId: siteId,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  fetch('https://your-analytics.com/api/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
})();
