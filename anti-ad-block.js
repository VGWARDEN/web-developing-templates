    function showAdBlockOverlay() {
      const adBlockOverlay = document.createElement('div');
      adBlockOverlay.className = 'fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm z-[9999] text-center p-8';
      adBlockOverlay.setAttribute('role', 'dialog');
      adBlockOverlay.setAttribute('aria-labelledby', 'adblock-title');
      adBlockOverlay.setAttribute('aria-describedby', 'adblock-description');
      adBlockOverlay.innerHTML = `
        <div class="bg-white dark:bg-dark rounded-2xl p-8 shadow-2xl max-w-md w-full animate-fade-in">
          <i data-lucide="alert-triangle" class="w-12 h-12 text-error dark:text-red-300 mx-auto mb-4" aria-hidden="true"></i>
          <h2 id="adblock-title" class="text-3xl font-bold text-primary mb-4">Ad Blocker Detected</h2>
          <p id="adblock-description" class="text-gray-700 dark:text-gray-300 mb-6">Please disable your ad blocker to continue accessing CrazyAlts. Ads help us keep this service free!</p>
          <div class="flex flex-col space-y-4">
            <button onclick="location.reload()" class="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 text-lg font-semibold focus:ring-4 focus:ring-primary/50">I Disabled Adblock</button>
            <button onclick="detectAdBlock()" class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 text-lg font-semibold focus:ring-4 focus:ring-gray-400/50 dark:focus:ring-gray-500/50">Check Again</button>
          </div>
        </div>
      `;
      document.body.appendChild(adBlockOverlay);
      document.body.style.overflow = 'hidden';
      lucide.createIcons();
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

      // Check after delay
      setTimeout(() => {
        if (adBait.offsetHeight === 0 || scriptBlocked || cssBlocked || networkBlocked) {
          adBlocked = true;
        }

        if (adBlocked) {
          showAdBlockOverlay();
        } else {
          document.body.style.overflow = 'auto';
          const existingOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-90');
          if (existingOverlay) existingOverlay.remove();
        }

        // Cleanup
        adBait.remove();
        cssTest.remove();
      }, 3000);
    }

    // Run detection on page load
    window.addEventListener('load', detectAdBlock);
