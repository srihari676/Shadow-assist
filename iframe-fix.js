/* =====================================================================
 * Shadow UI — iframe-fix.js
 * Uses MutationObserver to add allow="microphone; autoplay" to the
 * Shadow UI panel iframe the moment it's created, before it loads.
 * ===================================================================== */
(function () {
  "use strict";

  function fixIframe(iframe) {
    if (iframe && iframe.classList.contains("shadow-ui-panel-iframe")) {
      if (iframe.allow !== "microphone; autoplay") {
        iframe.allow = "microphone; autoplay";
        console.log("[Shadow UI] Added microphone permission to panel iframe");
      }
    }
  }

  // Fix any existing iframes
  document.querySelectorAll(".shadow-ui-panel-iframe").forEach(fixIframe);

  // Watch for new iframes being added
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && node.classList.contains("shadow-ui-panel-iframe")) {
            fixIframe(node);
          }
          // Also check children
          if (node.querySelectorAll) {
            node.querySelectorAll(".shadow-ui-panel-iframe").forEach(fixIframe);
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  console.log("[Shadow UI] iframe-fix.js watching for panel iframe");
})();