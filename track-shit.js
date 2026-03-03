(function () {
  "use strict";

  /* ===== CONFIG ===== */
  const THRESHOLD = 160;
  const ROTATE_MS = 3000;
  const SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3";

  const MEMES = [
    { t: "👀 SUS DETECTED", d: "Bro really opened DevTools 💀", g: "https://media.tenor.com/NaKxZXhB2JkAAAAd/among-us-sus.gif" },
    { t: "🫢 BIG YIKES", d: "Mind your business", g: "https://media.tenor.com/6iwyKIpld3QAAAAd/yikes.gif" },
    { t: "☕ ERROR 418", d: "Debugger not allowed", g: "https://media.tenor.com/1joDu-lOqC8AAAAC/teapot-fail.gif" },
    { t: "😈 NICE TRY", d: "This ain't your repo", g: "https://media.tenor.com/0AVbKGY_MxMAAAAC/hacker.gif" },
    { t: "📸 CAUGHT", d: "Inspecting in 4K", g: "https://media.tenor.com/3z6H0X7HqQwAAAAC/caught.gif" }
  ];

  /* ===== STATE ===== */
  let locked = false;
  let timer = null;
  let audio = null;
  let audioReady = false;

  /* ===== AUDIO UNLOCK ===== */
  function unlockAudio() {
    if (audioReady) return;
    audioReady = true;
    audio = new Audio(SOUND_URL);
    audio.volume = 0.6;
    audio.play().catch(() => {});
    audio.pause();
    audio.currentTime = 0;
  }

  ["click", "keydown", "touchstart"].forEach(e =>
    document.addEventListener(e, unlockAudio, { once: true })
  );

  function playSound() {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  /* ===== DEVTOOLS CHECK ===== */
  function devtoolsOpen() {
    return (
      Math.abs(window.outerWidth - window.innerWidth) > THRESHOLD ||
      Math.abs(window.outerHeight - window.innerHeight) > THRESHOLD
    );
  }

  /* ===== RENDER BLOCK PAGE ===== */
  function render(m) {
    document.documentElement.innerHTML = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Nice Try</title>
<style>
html,body{
  margin:0;height:100%;
  background:#050505;color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-family:system-ui,Segoe UI,Roboto;
}
.box{text-align:center;gap:16px;display:flex;flex-direction:column}
img{width:200px;border-radius:16px;box-shadow:0 0 50px rgba(255,255,255,.25)}
h1{font-size:26px;margin:0;position:relative}
h1::before,h1::after{
  content:attr(data-t);
  position:absolute;left:0;top:0
}
h1::before{color:#f0f;animation:g 1.6s infinite}
h1::after{color:#0ff;animation:g 1.2s infinite reverse}
@keyframes g{
  0%{transform:none}
  20%{transform:translate(-2px,2px)}
  40%{transform:translate(-2px,-2px)}
  60%{transform:translate(2px,2px)}
}
p{opacity:.75;font-size:14px}
</style>
</head>
<body>
<div class="box">
  <img src="${m.g}">
  <h1 data-t="${m.t}">${m.t}</h1>
  <p>${m.d}</p>
</div>
</body>
</html>`;
  }

  /* ===== LOCK / UNLOCK ===== */
  function lock() {
    if (locked) return;
    locked = true;
    playSound();

    let i = Math.floor(Math.random() * MEMES.length);
    render(MEMES[i]);

    timer = setInterval(() => {
      i = (i + 1) % MEMES.length;
      render(MEMES[i]);
    }, ROTATE_MS);
  }

  function unlock() {
    if (!locked) return;
    clearInterval(timer);
    location.reload();
  }

  /* ===== LOOP ===== */
  setInterval(() => devtoolsOpen() ? lock() : unlock(), 250);

  /* ===== BLOCK INSPECT SHORTCUTS ===== */
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (
      k === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(k)) ||
      (e.ctrlKey && k === "u")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  document.addEventListener("contextmenu", e => e.preventDefault(), true);

})();
