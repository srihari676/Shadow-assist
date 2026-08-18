/* =====================================================================
 * Shadow UI — voice-worker.js
 * ---------------------------------------------------------------------
 * LiveKit token generation + OpenRouter text fallback.
 * Imported by background.js as a module. Adds new message handlers
 * without touching the existing ones.
 * ===================================================================== */

// ---- Config ----
const MODEL = "nvidia/nemotron-3-nano-30b-a3b:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const LK_API_KEY = "devkey";
const LK_API_SECRET = "secret";

// ---- System prompt ----
const systemPrompt = `You are Shadow UI, a voice-driven accessibility assistant running inside a Chrome browser extension. You help users interact with and understand the web page currently open in their active tab.

You have access to tools that run on the live page. Your job is to interpret the user's spoken request and respond conversationally.

Available tools:
- describe_page: Scan the current page's DOM and return a summary.
- read_element: Find a labeled field by description and read its value.
- fill_form_field: Find a form field by description and fill it with a value.
- simplify_question: Rewrite a field's label into plain language.
- toggle_high_contrast: Enable or disable high contrast mode.
- toggle_large_text: Enable or disable large text mode.
- switch_tab: Switch between accessibility, form_filler, or meet_asl tabs.

Guidelines:
- Keep responses short and conversational. One or two sentences.
- If the request doesn't map to a tool, respond helpfully.`;

// ---- Tool schema (OpenAI function-calling format) ----
const tools = [
  { type: "function", function: { name: "describe_page", description: "Scan the current page's DOM and return a summary.", parameters: { type: "object", properties: {}, required: [] } } },
  { type: "function", function: { name: "read_element", description: "Find a labeled field by description and read its value.", parameters: { type: "object", properties: { element: { type: "string", description: "Description of the element." } }, required: ["element"] } } },
  { type: "function", function: { name: "fill_form_field", description: "Find a form field by description and fill it.", parameters: { type: "object", properties: { field: { type: "string", description: "Field description." }, value: { type: "string", description: "Value to enter." } }, required: ["field", "value"] } } },
  { type: "function", function: { name: "simplify_question", description: "Rewrite a field label into plain language.", parameters: { type: "object", properties: { field: { type: "string", description: "Field description." } }, required: ["field"] } } },
  { type: "function", function: { name: "toggle_high_contrast", description: "Toggle high contrast mode.", parameters: { type: "object", properties: { enabled: { type: "boolean" } }, required: ["enabled"] } } },
  { type: "function", function: { name: "toggle_large_text", description: "Toggle large text mode.", parameters: { type: "object", properties: { enabled: { type: "boolean" } }, required: ["enabled"] } } },
  { type: "function", function: { name: "switch_tab", description: "Switch sidebar tab.", parameters: { type: "object", properties: { tab: { type: "string", enum: ["accessibility", "form_filler", "meet_asl"] } }, required: ["tab"] } } },
];

// ===================================================================
// Register additional message handlers
// ===================================================================

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "VOICE_TRANSCRIPT") {
    handleTranscript(msg.transcript)
      .then((result) => sendResponse(result))
      .catch((err) => {
        console.error("[Shadow UI Voice] Error:", err);
        sendResponse({ spokenText: "Sorry, something went wrong: " + err.message, toolResults: [] });
      });
    return true;
  }

  if (msg.type === "GET_LIVEKIT_TOKEN") {
    generateLiveKitToken()
      .then((token) => sendResponse({ token }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  return false;
});

// ===================================================================
// LiveKit JWT token generation
// ===================================================================
async function generateLiveKitToken() {
  const roomName = "shadow-ui-room-" + Date.now();
  const participantName = "panel-" + Math.random().toString(36).slice(2, 8);
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

// ===================================================================
// OpenRouter text fallback
// ===================================================================
async function handleTranscript(transcript) {
  const { openrouterApiKey } = await chrome.storage.local.get("openrouterApiKey");
  if (!openrouterApiKey) {
    return { spokenText: "Please set your OpenRouter API key in settings.", toolResults: [] };
  }
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab) {
    return { spokenText: "No active tab found.", toolResults: [] };
  }
  const message = await callOpenRouter(openrouterApiKey, transcript);
  const spokenText = message.content || "";
  const toolResults = [];
  const toolCalls = message.tool_calls || [];
  for (const call of toolCalls) {
    const fnName = call.function.name;
    let args = {};
    try { args = JSON.parse(call.function.arguments || "{}"); } catch (e) {}
    if (fnName === "switch_tab") {
      toolResults.push({ tool: "switch_tab", result: args.tab });
      continue;
    }
    // Route to content script using Shadow-assist's existing message types
    try {
      const result = await routeToolCall(fnName, args, activeTab.id);
      toolResults.push({ tool: fnName, result: result || "(done)" });
    } catch (err) {
      toolResults.push({ tool: fnName, result: `Couldn't access page. (${err.message})` });
    }
  }
  return { spokenText, toolResults };
}

async function routeToolCall(fnName, args, tabId) {
  // Map LLM tool names to Shadow-assist content script message types
  switch (fnName) {
    case "describe_page": {
      const resp = await chrome.tabs.sendMessage(tabId, { type: "ANALYZE_PAGE_INTELLIGENCE" });
      const form = await chrome.tabs.sendMessage(tabId, { type: "ANALYZE_PAGE_FORM" });
      const parts = [];
      if (resp?.analysis) parts.push(resp.analysis);
      if (form?.form) parts.push(`Found ${form.form.fields?.length || 0} form fields.`);
      return parts.join(" ") || "Page analyzed.";
    }
    case "read_element": {
      const formResp = await chrome.tabs.sendMessage(tabId, { type: "ANALYZE_PAGE_FORM" });
      const fields = formResp?.form?.fields || [];
      const q = (args.element || "").toLowerCase();
      const match = fields.find(f => f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q) || f.placeholder?.toLowerCase().includes(q));
      if (match) {
        return `Field "${match.label || match.name}" has value: "${match.value || "(empty)"}".`;
      }
      return `Couldn't find a field matching "${args.element}".`;
    }
    case "fill_form_field": {
      // First find the field
      const formResp = await chrome.tabs.sendMessage(tabId, { type: "ANALYZE_PAGE_FORM" });
      const fields = formResp?.form?.fields || [];
      const q = (args.field || "").toLowerCase();
      const match = fields.find(f => f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q) || f.placeholder?.toLowerCase().includes(q));
      if (!match) return `Couldn't find a field matching "${args.field}".`;
      const fieldType = match.type === "select" ? "select" : match.type === "checkbox" || match.type === "radio" ? "checkbox" : "text";
      await chrome.tabs.sendMessage(tabId, { type: "FILL_FIELD_DOM", payload: { fieldId: match.id, value: args.value, fieldType } });
      await chrome.tabs.sendMessage(tabId, { type: "HIGHLIGHT_FIELD_DOM", payload: { fieldId: match.id } });
      return `Filled "${match.label || match.name}" with "${args.value}".`;
    }
    case "simplify_question": {
      const formResp = await chrome.tabs.sendMessage(tabId, { type: "ANALYZE_PAGE_FORM" });
      const fields = formResp?.form?.fields || [];
      const q = (args.field || "").toLowerCase();
      const match = fields.find(f => f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q));
      if (!match) return `Couldn't find a field matching "${args.field}".`;
      return `Field "${match.label || match.name}" — try saying "fill the ${args.field} with your answer".`;
    }
    case "toggle_high_contrast": {
      await chrome.tabs.sendMessage(tabId, { type: "SETTINGS_UPDATED", payload: { highContrast: args.enabled } });
      return args.enabled ? "High contrast enabled." : "High contrast disabled.";
    }
    case "toggle_large_text": {
      await chrome.tabs.sendMessage(tabId, { type: "SETTINGS_UPDATED", payload: { largeText: args.enabled } });
      return args.enabled ? "Large text enabled." : "Large text disabled.";
    }
    default:
      return `Unknown tool: ${fnName}`;
  }
}

async function callOpenRouter(apiKey, transcript) {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://shadowui.extension",
      "X-Title": "Shadow UI",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ],
      tools,
      tool_choice: "auto",
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const choice = data.choices && data.choices[0];
  if (!choice || !choice.message) throw new Error("OpenRouter returned no message.");
  return choice.message;
}