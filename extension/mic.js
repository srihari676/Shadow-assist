/* =====================================================================
 * Shadow UI — mic.js
 * Runs in a popup window opened by the sidebar. Uses
 * webkitSpeechRecognition where the permission prompt works, then
 * sends the transcript to the sidebar via chrome.runtime messaging.
 * ===================================================================== */
(function () {
  "use strict";
  const indicator = document.getElementById("indicator");
  const statusEl = document.getElementById("status");
  const transcriptEl = document.getElementById("transcript");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    indicator.classList.add("error");
    statusEl.textContent = "Speech recognition not available. Use text input.";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  let finalTranscript = "", silenceTimer = null;
  recognition.onstart = () => { statusEl.textContent = "Listening..."; };
  recognition.onresult = (event) => {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      finalTranscript.trim() ? sendAndClose(finalTranscript) : (statusEl.textContent = "No speech detected.", setTimeout(() => window.close(), 1000));
    }, 2000);
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      r.isFinal ? (finalTranscript += r[0].transcript) : (interim += r[0].transcript);
    }
    transcriptEl.textContent = finalTranscript + interim || "(waiting...)";
    if (finalTranscript.trim()) { clearTimeout(silenceTimer); sendAndClose(finalTranscript); }
  };
  function sendAndClose(text) {
    try { chrome.runtime.sendMessage({ type: "MIC_TRANSCRIPT", transcript: text.trim() }); } catch (e) {}
    indicator.classList.add("done");
    statusEl.textContent = "Got it!";
    setTimeout(() => window.close(), 500);
  }
  recognition.onerror = (event) => {
    indicator.classList.add("error");
    statusEl.textContent = event.error === "not-allowed" ? "Mic blocked. Allow access and try again." : `Mic error: ${event.error}`;
    setTimeout(() => window.close(), 3000);
  };
  recognition.onend = () => {
    if (!finalTranscript.trim() && !transcriptEl.textContent) { setTimeout(() => window.close(), 1000); }
  };
  recognition.start();
})();