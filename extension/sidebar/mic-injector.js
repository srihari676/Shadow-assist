/* =====================================================================
 * Shadow UI — mic-injector.js (LiveKit real-time voice)
 * ---------------------------------------------------------------------
 * Injects a mic button into the sidebar. Uses LiveKit WebRTC for
 * real-time voice: getUserMedia → publish audio → agent STT→LLM→TTS
 * → subscribe to agent audio → play via <audio> element.
 *
 * The agent forwards tool calls back via RPC, which we route to the
 * content script using Shadow-assist's existing message types.
 * ===================================================================== */
(function () {
  "use strict";

  let micBtn = null;
  let room = null;
  let micStream = null;
  let micTrackPub = null;
  let isConnected = false;
  let isMicActive = false;
  let agentAudio = null;
  let micAudioContext = null;
  let micSourceNode = null;
  let micAnalyser = null;
  let micMeterTimer = null;
  let micStatusCard = null;
  let micStatusValue = null;
  let micStatusBar = null;

  const LK_HOST = "ws://localhost:7880";
  const LK_API_KEY = "devkey";
  const LK_API_SECRET = "secret";
  const LIVEKIT_ROOM_KEY = "shadow-ui-livekit-room-name";
  const LIVEKIT_PARTICIPANT_KEY = "shadow-ui-livekit-participant-name";
  const PROFILE_STORAGE_KEY = "shadow_ui_user_profile";

  async function ensureProfileSetup() {
    const stored = await new Promise((resolve) => {
      chrome.storage.local.get([PROFILE_STORAGE_KEY], (result) => resolve(result[PROFILE_STORAGE_KEY]));
    });
    if (stored?.name?.trim() && Array.isArray(stored.accessibilityNeeds)) return true;
    window.postMessage({ type: "SWITCH_TAB", payload: { tab: "accessibility" } }, "*");
    showToast("Complete your profile in the Accessibility section before using voice");
    return false;
  }

  function getOrCreateSessionValue(key, prefix) {
    try {
      const existing = sessionStorage.getItem(key);
      if (existing) return existing;
      const value = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(key, value);
      return value;
    } catch {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
  }

  // Generate LiveKit JWT token directly (avoids background messaging issues from iframe)
  async function generateLiveKitToken() {
    const roomName = getOrCreateSessionValue(LIVEKIT_ROOM_KEY, "shadow-ui-room");
    const participantName = getOrCreateSessionValue(LIVEKIT_PARTICIPANT_KEY, "panel");
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      exp: now + 3600, iss: LK_API_KEY, nbf: now, sub: participantName,
      video: { room: roomName, roomJoin: true, canPublish: true, canSubscribe: true },
    };
    const b64url = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const headerEncoded = b64url(header);
    const payloadEncoded = b64url(payload);
    const signingInput = headerEncoded + "." + payloadEncoded;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(LK_API_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
    const sigEncoded = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    return signingInput + "." + sigEncoded;
  }

  function createMicButton() {
    if (document.getElementById("shadow-ui-mic-btn")) return;

    // Hidden audio element for agent voice output
    agentAudio = document.createElement("audio");
    agentAudio.autoplay = true;
    agentAudio.style.display = "none";
    document.body.appendChild(agentAudio);

    micStatusCard = document.createElement("div");
    micStatusCard.id = "shadow-ui-mic-status-card";
    micStatusCard.style.cssText = `
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 220px;
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid rgba(99,102,241,0.24);
      background: rgba(15,23,42,0.92);
      color: #e2e8f0;
      box-shadow: 0 14px 36px rgba(15,23,42,0.28);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      backdrop-filter: blur(10px);
    `;
    micStatusCard.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <strong style="font-size:12px;letter-spacing:0.02em;">Mic monitor</strong>
        <span style="padding:3px 8px;border-radius:999px;background:rgba(99,102,241,0.22);color:#c7d2fe;font-weight:700;">active</span>
      </div>
      <div id="shadow-ui-mic-status-value" style="line-height:1.35;color:#94a3b8;">Waiting for mic...</div>
      <div style="height:8px;border-radius:999px;background:rgba(148,163,184,0.2);overflow:hidden;">
        <div id="shadow-ui-mic-status-bar" style="width:0%;height:100%;border-radius:999px;background:linear-gradient(90deg,#22c55e,#f59e0b,#ef4444);transition:width 120ms linear;"></div>
      </div>
    `;
    document.body.appendChild(micStatusCard);
    micStatusValue = micStatusCard.querySelector("#shadow-ui-mic-status-value");
    micStatusBar = micStatusCard.querySelector("#shadow-ui-mic-status-bar");
    updateMicStatus("Idle. Click the mic to start.", 0, 0, false);

    micBtn = document.createElement("button");
    micBtn.id = "shadow-ui-mic-btn";
    micBtn.innerHTML = "&#127908;";
    micBtn.title = "Voice command (LiveKit)";
    micBtn.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: #6366f1;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99,102,241,0.4);
      transition: all 0.2s;
    `;
    micBtn.addEventListener("mouseenter", () => { if (!isMicActive) micBtn.style.transform = "scale(1.1)"; });
    micBtn.addEventListener("mouseleave", () => { if (!isMicActive) micBtn.style.transform = "scale(1)"; });

    micBtn.addEventListener("click", toggleMic);

    // Add pulse animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shadowUiMicPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.08); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(micBtn);
    console.log("[Shadow UI Voice] Mic button injected");
  }

  async function toggleMic() {
    if (isMicActive) {
      await stopMic();
      return;
    }
    await startMic();
  }

  async function startMic() {
    try {
      if (!await ensureProfileSetup()) return;
      showToast("Connecting to voice agent...");

      if (!isConnected) {
        await connectLiveKit();
        if (!isConnected) return;
      }

      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      console.log("[Shadow UI Voice] getUserMedia OK, tracks:", micStream.getAudioTracks().length);
      const audioTrack = micStream.getAudioTracks()[0];
      console.log("[Shadow UI Voice] Audio track settings:", audioTrack.getSettings());
      console.log("[Shadow UI Voice] Audio track enabled/muted:", audioTrack.enabled, audioTrack.muted);
      audioTrack.addEventListener("mute", () => {
        console.warn("[Shadow UI Voice] Audio track muted by browser or device");
      });
      audioTrack.addEventListener("unmute", () => {
        console.log("[Shadow UI Voice] Audio track unmuted");
      });
      audioTrack.addEventListener("ended", () => {
        console.warn("[Shadow UI Voice] Audio track ended");
      });

      startMicLevelMonitor(micStream);

      // Publish with an explicit microphone source so the agent treats the
      // track as live speech input.
      const pubOpts = { name: "microphone", source: LivekitClient.Track.Source.Microphone };
      micTrackPub = await room.localParticipant.publishTrack(audioTrack, pubOpts);
      console.log("[Shadow UI Voice] Track published:", micTrackPub.trackSid, "source:", micTrackPub.trackSource);

      isMicActive = true;
      micBtn.style.background = "#cc0033";
      micBtn.style.animation = "shadowUiMicPulse 1.2s infinite";
      showToast("Listening... speak now");
    } catch (err) {
      console.error("[Shadow UI Voice] Mic error:", err);
      showToast("Mic error: " + err.message);
      resetMicButton();
    }
  }

  async function stopMic() {
    try {
      if (micTrackPub) {
        await micTrackPub.unpublish();
        micTrackPub = null;
      }
      stopMicLevelMonitor();
      if (micStream) {
        micStream.getTracks().forEach((t) => t.stop());
        micStream = null;
      }
    } catch (e) {}
    isMicActive = false;
    resetMicButton();
    showToast("Mic off");
  }

  function resetMicButton() {
    if (micBtn) {
      micBtn.style.background = "#6366f1";
      micBtn.style.animation = "none";
      micBtn.style.transform = "scale(1)";
    }
  }

  function updateMicStatus(text, rms, peak, active) {
    if (micStatusValue) {
      micStatusValue.textContent = text;
      micStatusValue.style.color = active ? "#e2e8f0" : "#94a3b8";
    }
    if (micStatusBar) {
      const clamped = Math.max(0, Math.min(100, Math.round(Math.max(rms, peak) * 180)));
      micStatusBar.style.width = `${clamped}%`;
      micStatusBar.style.opacity = active ? "1" : "0.45";
    }
  }

  function startMicLevelMonitor(stream) {
    stopMicLevelMonitor();

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      console.warn("[Shadow UI Voice] AudioContext unavailable; skipping mic level monitor");
      return;
    }

    try {
      micAudioContext = new AudioContextCtor();
      micSourceNode = micAudioContext.createMediaStreamSource(stream);
      micAnalyser = micAudioContext.createAnalyser();
      micAnalyser.fftSize = 2048;
      micAnalyser.smoothingTimeConstant = 0.2;
      micSourceNode.connect(micAnalyser);

      const buffer = new Uint8Array(micAnalyser.fftSize);
      let tick = 0;
      micMeterTimer = window.setInterval(() => {
        if (!micAnalyser) return;
        micAnalyser.getByteTimeDomainData(buffer);

        let sumSquares = 0;
        let peak = 0;
        for (let i = 0; i < buffer.length; i += 1) {
          const normalized = (buffer[i] - 128) / 128;
          const absValue = Math.abs(normalized);
          if (absValue > peak) peak = absValue;
          sumSquares += normalized * normalized;
        }

        const rms = Math.sqrt(sumSquares / buffer.length);
        const dbfs = rms > 0 ? (20 * Math.log10(rms)).toFixed(1) : "-inf";
        tick += 1;
        updateMicStatus(`rms=${rms.toFixed(4)} peak=${peak.toFixed(4)} dBFS=${dbfs}`, rms, peak, true);
        console.log(
          `[Shadow UI Voice] Mic level #${tick}: rms=${rms.toFixed(4)} peak=${peak.toFixed(4)} dBFS=${dbfs}`,
        );

        if (rms < 0.005 && peak < 0.01) {
          console.warn("[Shadow UI Voice] Mic input is near silence while active");
        }
      }, 1000);

      console.log("[Shadow UI Voice] Mic level monitor started");
    } catch (err) {
      console.warn("[Shadow UI Voice] Failed to start mic level monitor:", err);
      stopMicLevelMonitor();
    }
  }

  function stopMicLevelMonitor() {
    if (micMeterTimer !== null) {
      clearInterval(micMeterTimer);
      micMeterTimer = null;
    }
    try {
      if (micSourceNode) {
        micSourceNode.disconnect();
        micSourceNode = null;
      }
      if (micAnalyser) {
        micAnalyser.disconnect();
        micAnalyser = null;
      }
      if (micAudioContext) {
        micAudioContext.close().catch(() => {});
        micAudioContext = null;
      }
    } catch (err) {
      console.warn("[Shadow UI Voice] Failed to stop mic level monitor:", err);
    }

    updateMicStatus("Mic off", 0, 0, false);
  }

  async function connectLiveKit() {
    try {
      // Generate token directly (sidebar iframe can't reach background reliably)
      const token = await generateLiveKitToken();
      const roomName = getOrCreateSessionValue(LIVEKIT_ROOM_KEY, "shadow-ui-room");
      const participantName = getOrCreateSessionValue(LIVEKIT_PARTICIPANT_KEY, "panel");

      room = new LivekitClient.Room({ adaptiveStream: true });
      console.log("[Shadow UI Voice] Connecting with room:", roomName, "participant:", participantName);

      room.on(
        LivekitClient.RoomEvent.TrackSubscribed,
        (track, publication, participant) => {
          console.log("[Shadow UI Voice] TrackSubscribed:", track.kind, "from", participant.identity);
          if (track.kind === "audio" && !participant.isLocal) {
            agentAudio.srcObject = null;
            agentAudio.srcObject = track.mediaStream;
            agentAudio.play().catch((e) => console.warn("[Shadow UI Voice] Audio play failed:", e));
            console.log("[Shadow UI Voice] Agent audio attached to <audio> element");
          }
        }
      );

      // Log when our own mic track is actually published to the server
      room.on(LivekitClient.RoomEvent.LocalTrackPublished, (publication, track) => {
        console.log("[Shadow UI Voice] LocalTrackPublished:", publication.trackSid, "kind:", track?.kind);
      });

      // Log active speaker changes — proves audio is flowing to the server
      room.on(LivekitClient.RoomEvent.ActiveSpeakerChanged, (speakers) => {
        const names = speakers.map((s) => s.identity + (s.isLocal ? " (local)" : "")).join(", ");
        console.log("[Shadow UI Voice] Active speakers:", names || "(none)");
      });

      // Log participant join/leave so we can see the agent arrive
      room.on(LivekitClient.RoomEvent.ParticipantConnected, (p) => {
        console.log("[Shadow UI Voice] Participant joined:", p.identity);
      });
      room.on(LivekitClient.RoomEvent.ParticipantDisconnected, (p) => {
        console.log("[Shadow UI Voice] Participant left:", p.identity);
      });

      room.on(LivekitClient.RoomEvent.Disconnected, () => {
        isConnected = false;
        isMicActive = false;
        resetMicButton();
        showToast("Disconnected from voice agent");
      });

      const rpcMethods = [
        "describe_page", "read_element", "fill_form_field",
        "simplify_question", "toggle_high_contrast", "toggle_large_text",
        "toggle_dyslexia_font", "toggle_simplified_language", "switch_tab",
        "explain_element", "submit_form", "search_product", "add_to_cart", "extract_products",
      ];

      for (const method of rpcMethods) {
        room.localParticipant.registerRpcMethod(method, async (invocation) => {
          const args = JSON.parse(invocation.payload || "{}");
          return await handleToolCall(method, args);
        });
      }

      await room.connect(LK_HOST, token);
      isConnected = true;
      console.log("[Shadow UI Voice] Connected to LiveKit room");
      showToast("Connected to voice agent");
    } catch (err) {
      console.error("[Shadow UI Voice] LiveKit connection failed:", err);
      showToast("Voice agent unavailable: " + err.message);
    }
  }

  async function handleToolCall(toolName, args) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return JSON.stringify({ result: "No active tab." });

      switch (toolName) {
        case "describe_page": {
          const resp = await chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE_INTELLIGENCE" });
          const form = await chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE_FORM" });
          const parts = [];
          if (resp?.analysis) parts.push(resp.analysis);
          if (form?.form) parts.push(`Found ${form.form.fields?.length || 0} form fields.`);
          return JSON.stringify({ result: parts.join(" ") || "Page analyzed." });
        }
        case "read_element": {
          const formResp = await chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE_FORM" });
          const fields = formResp?.form?.fields || [];
          const q = (args.element || "").toLowerCase();
          const match = fields.find(f => f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q) || f.placeholder?.toLowerCase().includes(q));
          if (match) return JSON.stringify({ result: `Field "${match.label || match.name}" has value: "${match.value || "(empty)"}".` });
          return JSON.stringify({ result: `Couldn't find a field matching "${args.element}".` });
        }
        case "fill_form_field": {
          const formResp = await chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE_FORM" });
          const fields = formResp?.form?.fields || [];
          const q = (args.field || "").toLowerCase();
          const match = fields.find(f => f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q) || f.placeholder?.toLowerCase().includes(q));
          if (!match) return JSON.stringify({ result: `Couldn't find a field matching "${args.field}".` });
          const fieldType = match.type === "select" ? "select" : match.type === "checkbox" || match.type === "radio" ? "checkbox" : "text";
          await chrome.tabs.sendMessage(tab.id, { type: "FILL_FIELD_DOM", payload: { fieldId: match.id, value: args.value, fieldType } });
          await chrome.tabs.sendMessage(tab.id, { type: "HIGHLIGHT_FIELD_DOM", payload: { fieldId: match.id } });
          return JSON.stringify({ result: `Filled "${match.label || match.name}" with "${args.value}".` });
        }
        case "simplify_question": {
          const formResp = await chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE_FORM" });
          const fields = formResp?.form?.fields || [];
          const q = (args.field || "").toLowerCase();
          const match = fields.find(f => f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q));
          if (!match) return JSON.stringify({ result: `Couldn't find a field matching "${args.field}".` });
          return JSON.stringify({ result: `Field "${match.label || match.name}" — try saying "fill the ${args.field} with your answer".` });
        }
        case "toggle_high_contrast": {
          await chrome.tabs.sendMessage(tab.id, { type: "SETTINGS_UPDATED", payload: { highContrast: args.enabled } });
          return JSON.stringify({ result: args.enabled ? "High contrast enabled." : "High contrast disabled." });
        }
        case "toggle_large_text": {
          await chrome.tabs.sendMessage(tab.id, { type: "SETTINGS_UPDATED", payload: { largeText: args.enabled } });
          return JSON.stringify({ result: args.enabled ? "Large text enabled." : "Large text disabled." });
        }
        case "toggle_dyslexia_font": {
          await chrome.tabs.sendMessage(tab.id, { type: "SETTINGS_UPDATED", payload: { dyslexiaFont: args.enabled } });
          return JSON.stringify({ result: args.enabled ? "Dyslexia-friendly font enabled." : "Dyslexia-friendly font disabled." });
        }
        case "toggle_simplified_language": {
          await chrome.tabs.sendMessage(tab.id, { type: "SETTINGS_UPDATED", payload: { simplifiedWording: args.enabled } });
          return JSON.stringify({ result: args.enabled ? "Simplified language enabled." : "Simplified language disabled." });
        }
        case "switch_tab": {
          window.postMessage({ type: "SWITCH_TAB", payload: { tab: args.tab } }, "*");
          return JSON.stringify({ result: `Switched to ${args.tab} tab.` });
        }
        case "explain_element": {
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "EXPLAIN_ELEMENT_DOM",
            payload: { elementId: args.elementId, label: args.label },
          });
          return JSON.stringify({ result: response?.explanation || "I could not explain that element." });
        }
        case "submit_form": {
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "SUBMIT_FORM_DOM",
            payload: { submitButtonId: args.submitButtonId },
          });
          return JSON.stringify({ result: response?.success ? "Form submitted." : "I could not submit the form." });
        }
        case "search_product": {
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "SEARCH_PRODUCT_DOM",
            payload: { query: args.query },
          });
          return JSON.stringify({ result: response?.result || response?.message || "Product search completed." });
        }
        case "add_to_cart": {
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "ADD_TO_CART_DOM",
            payload: { query: args.query, quantity: args.quantity },
          });
          return JSON.stringify({ result: response?.result || response?.message || "Cart action completed." });
        }
        case "extract_products": {
          const response = await chrome.tabs.sendMessage(tab.id, { type: "EXTRACT_PRODUCTS_DOM" });
          const products = response?.products || [];
          return JSON.stringify({ result: products.length ? JSON.stringify(products) : "No products found." });
        }
        default:
          return JSON.stringify({ result: `Unknown tool: ${toolName}` });
      }
    } catch (err) {
      return JSON.stringify({ result: `Error: ${err.message}` });
    }
  }

  function showToast(text) {
    let toast = document.getElementById("shadow-ui-voice-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "shadow-ui-voice-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 72px;
        right: 16px;
        background: #1e293b;
        color: #fff;
        padding: 10px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-family: system-ui, sans-serif;
        max-width: 280px;
        z-index: 999999;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.3s;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createMicButton);
  } else {
    createMicButton();
  }
})();