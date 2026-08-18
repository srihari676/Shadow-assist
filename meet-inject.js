/**
 * meet-inject.js
 * ---------------------------------------------------------------
 * Runs in the Meet page's MAIN world (i.e. as if it were Meet's own
 * code) so it can wrap navigator.mediaDevices.getUserMedia BEFORE
 * Meet's own scripts call it. No MediaPipe/WASM runs here — this
 * file only does 2D canvas compositing, so Meet's own (stricter)
 * page CSP never gets in the way.
 *
 * Flow:
 *   1. Meet calls getUserMedia({video: true, ...}) like normal.
 *   2. We call the real getUserMedia to get the real camera stream.
 *   3. We draw each frame of that stream onto a hidden canvas, plus
 *      the current caption text on top.
 *   4. canvas.captureStream() becomes the video track we hand back
 *      to Meet, combined with the original audio track(s).
 *   5. meet-bridge.js (isolated world) relays caption text from the
 *      extension's side panel into this file via a window event,
 *      since MAIN-world scripts can't use chrome.runtime directly.
 * ---------------------------------------------------------------
 */

(() => {
  console.log("[SignCaption] meet-inject.js loaded, wrapping getUserMedia");

  const ORIGINAL_GET_USER_MEDIA = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  let currentCaption = "";
  let captionEnabled = true;

  window.addEventListener("__signcaption_caption_update", (e) => {
    currentCaption = (e.detail && e.detail.text) || "";
    console.log("[SignCaption] caption updated:", JSON.stringify(currentCaption));
  });

  window.addEventListener("__signcaption_toggle", (e) => {
    captionEnabled = !!(e.detail && e.detail.enabled);
    console.log("[SignCaption] burn-in toggled:", captionEnabled);
  });

  function buildCompositedStream(originalStream) {
    const videoTrack = originalStream.getVideoTracks()[0];
    if (!videoTrack) return originalStream; // nothing to composite onto

    const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
    const width = settings.width || 1280;
    const height = settings.height || 720;

    const sourceVideo = document.createElement("video");
    sourceVideo.srcObject = originalStream;
    sourceVideo.muted = true;
    sourceVideo.playsInline = true;
    sourceVideo.play().catch(() => {});

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    let rafId = null;
    function drawFrame() {
      if (sourceVideo.readyState >= 2) {
        ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);

        if (captionEnabled && currentCaption) {
          const fontSize = Math.max(18, Math.round(canvas.width * 0.03));
          ctx.font = `600 ${fontSize}px "IBM Plex Mono", Menlo, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          const paddingX = fontSize * 0.6;
          const paddingY = fontSize * 0.5;
          const textWidth = ctx.measureText(currentCaption).width;
          const boxW = textWidth + paddingX * 2;
          const boxH = fontSize + paddingY * 2;
          const boxX = canvas.width / 2 - boxW / 2;
          const boxY = canvas.height - boxH - canvas.height * 0.06;

          ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
          ctx.beginPath();
          ctx.roundRect
            ? ctx.roundRect(boxX, boxY, boxW, boxH, 8)
            : ctx.rect(boxX, boxY, boxW, boxH);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.fillText(currentCaption, canvas.width / 2, boxY + boxH - paddingY * 0.9);
        }
      }
      rafId = requestAnimationFrame(drawFrame);
    }
    rafId = requestAnimationFrame(drawFrame);

    const canvasStream = canvas.captureStream(30);
    const composedTrack = canvasStream.getVideoTracks()[0];

    const composedStream = new MediaStream();
    composedStream.addTrack(composedTrack);
    originalStream.getAudioTracks().forEach((t) => composedStream.addTrack(t));

    // Keep the underlying real camera/mic alive/stopped in sync with
    // whatever Meet does to the stream it thinks it owns.
    const stopAll = () => {
      cancelAnimationFrame(rafId);
      originalStream.getTracks().forEach((t) => t.stop());
    };
    composedTrack.addEventListener("ended", stopAll);
    videoTrack.addEventListener("ended", () => composedTrack.stop());

    return composedStream;
  }

  navigator.mediaDevices.getUserMedia = async function (constraints) {
    console.log("[SignCaption] getUserMedia called with constraints:", constraints);
    const stream = await ORIGINAL_GET_USER_MEDIA(constraints);
    if (!constraints || !constraints.video) {
      console.log("[SignCaption] no video requested, passing stream through unchanged");
      return stream;
    }
    try {
      const composed = buildCompositedStream(stream);
      console.log("[SignCaption] returning composited stream to Meet:", composed);
      return composed;
    } catch (err) {
      console.error("[SignCaption] failed to composite captions onto stream, using raw camera instead.", err);
      return stream;
    }
  };
})();
