/**
 * meet-bridge.js
 * ---------------------------------------------------------------
 * Runs in the normal (isolated) content-script world, so it has
 * chrome.runtime access — unlike meet-inject.js, which runs in the
 * page's MAIN world so it can hook getUserMedia early. This file's
 * only job is passing messages between the two.
 * ---------------------------------------------------------------
 */

console.log("[SignCaption bridge] meet-bridge.js loaded");

chrome.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) return;
  console.log("[SignCaption bridge] received message:", message);

  if (message.type === "signcaption:update") {
    window.dispatchEvent(
      new CustomEvent("__signcaption_caption_update", { detail: { text: message.text || "" } })
    );
  }

  if (message.type === "signcaption:toggle") {
    window.dispatchEvent(
      new CustomEvent("__signcaption_toggle", { detail: { enabled: !!message.enabled } })
    );
  }
});
