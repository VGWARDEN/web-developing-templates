function showAdBlockOverlay() {
  const adBlockOverlay = document.createElement('div');
  adBlockOverlay.className = 'fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-100 z-[9999] text-center p-8'; // Solid black background for overlay
  adBlockOverlay.setAttribute('role', 'dialog');
  adBlockOverlay.setAttribute('aria-labelledby', 'adblock-title');
  adBlockOverlay.setAttribute('aria-describedby', 'adblock-description');
  adBlockOverlay.innerHTML = `
    <div class="bg-black text-white rounded-2xl p-8 shadow-2xl max-w-sm sm:max-w-md w-full animate-fade-in border-4 border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animated-border">
      <i data-lucide="alert-triangle" class="w-12 h-12 text-error mx-auto mb-4" aria-hidden="true"></i>
      <h2 id="adblock-title" class="text-2xl sm:text-3xl font-bold mb-4">Ad Blocker Detected</h2>
      <p id="adblock-description" class="text-sm sm:text-base mb-6">Please disable your ad blocker to continue accessing CrazyAlts. Ads help us keep this service free!</p>
      <div class="flex flex-col space-y-4">
        <button onclick="location.reload()" class="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-500 transition-all duration-200 text-lg font-semibold focus:ring-4 focus:ring-red-500/50 sm:text-xl">I Have Disabled Adblock</button>
        <button onclick="detectAdBlock()" class="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200 text-lg font-semibold focus:ring-4 focus:ring-gray-400/50 sm:text-xl">Check Again</button>
      </div>
    </div>
  `;
  document.body.appendChild(adBlockOverlay);
  document.body.style.overflow = 'hidden';
}

function detectAdBlock() {
  let adBlocked = false;

  // Detection 1: Bait element check
  const adBait = document.createElement('div');
  adBait.className = 'adsbox adbanner advertisement google-ad adsense banner-ad sponsored';
  adBait.style.height = '1px';
  adBait.style.position = 'absolute';
  adBait.style.left = '-9999px';
  document.body.appendChild(adBait);

  // Detection 2: Ad script blocking check
  let scriptBlocked = false;
  try {
    const testScript = document.createElement('script');
    testScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    document.body.appendChild(testScript);
    testScript.onerror = () => { scriptBlocked = true; };
  } catch (e) {
    scriptBlocked = true;
  }

  // Detection 3: CSS filter check
  let cssBlocked = false;
  const cssTest = document.createElement('div');
  cssTest.className = 'ad-container banner-ad sponsored google-ad';
  cssTest.style.display = 'block';
  cssTest.style.width = '1px';
  cssTest.style.height = '1px';
  cssTest.style.position = 'absolute';
  cssTest.style.left = '-9999px';
  document.body.appendChild(cssTest);
  if (window.getComputedStyle(cssTest).display === 'none') {
    cssBlocked = true;
  }

  // Detection 4: Network request simulation
  let networkBlocked = false;
  try {
    fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { method: 'HEAD' })
      .catch(() => { networkBlocked = true; });
  } catch (e) {
    networkBlocked = true;
  }

  setTimeout(() => {
    if (adBait.offsetHeight === 0 || scriptBlocked || cssBlocked || networkBlocked) {
      adBlocked = true;
    }

    if (adBlocked) {
      showAdBlockOverlay();
    } else {
      document.body.style.overflow = 'auto';
      const existingOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-100');
      if (existingOverlay) existingOverlay.remove();
    }

    adBait.remove();
    cssTest.remove();
  }, 3000);
}

// Run detection on page load
window.addEventListener('load', detectAdBlock);

// Animation for fade-in effect
const style = document.createElement('style');
style.innerHTML = `
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .bg-gradient-to-r {
    background-image: linear-gradient(45deg, #f87171, #fbbf24, #f87171);
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: padding-box;
    animation: gradientBorder 2s linear infinite;
  }

  @keyframes gradientBorder {
    0% { border-color: #f87171; }
    50% { border-color: #fbbf24; }
    100% { border-color: #f87171; }
  }
`;
document.head.appendChild(style);
