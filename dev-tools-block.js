(function () {
    const THRESHOLD = 160;
    let locked = false;

    function devtoolsOpen() {
        return (
            window.outerWidth - window.innerWidth > THRESHOLD ||
            window.outerHeight - window.innerHeight > THRESHOLD
        );
    }

    function lock() {
        if (locked) return;
        locked = true;

        document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Access Restricted</title>
<style>
html,body{
    margin:0;
    width:100%;
    height:100%;
    background:#0a0a0a;
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    text-align:center;
}
h1{font-size:24px;margin-bottom:12px}
p{opacity:.75}
</style>
</head>
<body>
<div>
<h1>⚠️ Close DevTools</h1>
<p>Developer tools must be closed to access this site.</p>
</div>
</body>
</html>`;
    }

    function unlock() {
        if (!locked) return;
        location.reload();
    }

    // Core detector
    setInterval(() => {
        devtoolsOpen() ? lock() : unlock();
    }, 250);

    // Block right-click ONLY
    document.addEventListener(
        "contextmenu",
        e => e.preventDefault(),
        true
    );

    // Precise key blocking (NO zoom interference)
    document.addEventListener(
        "keydown",
        e => {
            const k = e.key.toLowerCase();

            const isDevShortcut =
                k === "f12" ||
                (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
                (e.metaKey && e.altKey && ["i", "j", "c"].includes(k)) ||
                (e.ctrlKey && k === "u");

            if (isDevShortcut) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        true
    );
})();
