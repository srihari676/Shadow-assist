/* =====================================================================
 * Access AI — LiveKit Agent (agent.ts)
 * ---------------------------------------------------------------------
 * Agent definition with all 14 tools. Each tool forwards its call to
 * the frontend (side panel) via LiveKit RPC, where the side panel
 * routes it to content.js (or handles switch_tab locally).
 * ===================================================================== */

import { voice, llm, getJobContext } from "@livekit/agents";
import { z } from "zod";

// ---- System prompt (same as original background.js) ----
const SYSTEM_PROMPT = `You are Access AI, a voice-driven accessibility assistant running inside a Chrome browser extension. You help users interact with and understand the web page currently open in their active tab.

You have access to tools that run on the live page (describe_page, read_element, fill_form_field, simplify_question, toggle_high_contrast, toggle_large_text, toggle_dyslexia_font, toggle_simplified_language, explain_element, submit_form, search_product, add_to_cart, extract_products) and one tool that switches the extension's own UI tab (switch_tab, with values: "accessibility", "form_filler", or "meet_asl").

Guidelines:
- When the user asks about the current page, call describe_page first to understand what's there.
- When the user asks to fill a field, call fill_form_field with a free-text "field" description (e.g. "email", "date of birth") and the value to enter.
- When the user asks to use their saved details or profile, call fill_form_field with the field description and omit "value" so the browser uses the stored profile detail.
- When the user asks to read a field, call read_element with a free-text "element" description.
- When the user asks to simplify a confusing label, call simplify_question with the field description.
- When the user asks to turn accessibility features on or off, call toggle_high_contrast or toggle_large_text with an "enabled" boolean.
- When the user asks to switch the extension's view (e.g. "show me the form filler"), call switch_tab with the appropriate tab value.
- Keep your spoken responses short and conversational — they will be read aloud via speech synthesis. One or two sentences is ideal.
- If the user's request doesn't map to a tool, respond with a brief helpful text message.`;

// ---- Helper: forward a tool call to the frontend via RPC ----
async function forwardToFrontend(
  method: string,
  payload: Record<string, unknown>
): Promise<string> {
  const room = getJobContext().room;
  // Find the first remote participant (the frontend/side panel)
  const participant = Array.from(room.remoteParticipants.values())[0];
  if (!participant) {
    throw new llm.ToolError("No frontend connected to the room.");
  }

  try {
    const response = await room.localParticipant!.performRpc({
      destinationIdentity: participant.identity,
      method,
      payload: JSON.stringify(payload),
      responseTimeout: 15_000, // 15 seconds for content script round trip
    });
    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new llm.ToolError(`Frontend tool call failed: ${msg}`);
  }
}

// ---- Tool: describe_page ----
const describePage = llm.tool({
  name: "describe_page",
  description:
    "Scan the current page's DOM (headings, labeled form fields, buttons) and return a short text summary of what's on the page.",
  parameters: z.object({}),
  execute: async () => {
    return await forwardToFrontend("describe_page", {});
  },
});

// ---- Tool: read_element ----
const readElement = llm.tool({
  name: "read_element",
  description:
    "Find a labeled field or button on the page by fuzzy string match and read back its current value or state.",
  parameters: z.object({
    element: z
      .string()
      .describe(
        'Free-text description of the element to read, e.g. "date of birth field", "email input", "submit button".'
      ),
  }),
  execute: async ({ element }) => {
    return await forwardToFrontend("read_element", { element });
  },
});

// ---- Tool: fill_form_field ----
const fillFormField = llm.tool({
  name: "fill_form_field",
  description:
    "Find a form field on the page by fuzzy string match against its label/placeholder/aria-label, set its value, dispatch an input event so frameworks pick up the change, and briefly highlight the element.",
  parameters: z.object({
    field: z
      .string()
      .describe(
        'Free-text description of the field to fill, e.g. "email", "first name", "date of birth".'
      ),
    value: z.string().optional().describe("Optional value to enter. If omitted, use the matching saved profile detail."),
  }),
  execute: async ({ field, value }) => {
    return await forwardToFrontend("fill_form_field", { field, value });
  },
});

// ---- Tool: simplify_question ----
const simplifyQuestion = llm.tool({
  name: "simplify_question",
  description:
    'Find a form field\'s label by fuzzy match and rewrite its visible text into plain language (e.g. "Date of birth" -> "When were you born?"). Uses a local mapping; does not call the LLM again.',
  parameters: z.object({
    field: z
      .string()
      .describe(
        'Free-text description of the field whose label should be simplified, e.g. "date of birth".'
      ),
  }),
  execute: async ({ field }) => {
    return await forwardToFrontend("simplify_question", { field });
  },
});

// ---- Tool: toggle_high_contrast ----
const toggleHighContrast = llm.tool({
  name: "toggle_high_contrast",
  description:
    "Inject or remove a high-contrast style tag on the live page (not the extension UI).",
  parameters: z.object({
    enabled: z
      .boolean()
      .describe("true to enable high contrast, false to disable."),
  }),
  execute: async ({ enabled }) => {
    return await forwardToFrontend("toggle_high_contrast", { enabled });
  },
});

// ---- Tool: toggle_large_text ----
const toggleLargeText = llm.tool({
  name: "toggle_large_text",
  description:
    "Inject or remove a large-text style tag on the live page (not the extension UI).",
  parameters: z.object({
    enabled: z
      .boolean()
      .describe("true to enable large text, false to disable."),
  }),
  execute: async ({ enabled }) => {
    return await forwardToFrontend("toggle_large_text", { enabled });
  },
});

// ---- Tool: toggle_dyslexia_font ----
const toggleDyslexiaFont = llm.tool({
  name: "toggle_dyslexia_font",
  description: "Enable or disable the page's dyslexia-friendly font mode.",
  parameters: z.object({
    enabled: z.boolean().describe("true to enable the font, false to disable it."),
  }),
  execute: async ({ enabled }) => {
    return await forwardToFrontend("toggle_dyslexia_font", { enabled });
  },
});

// ---- Tool: toggle_simplified_language ----
const toggleSimplifiedLanguage = llm.tool({
  name: "toggle_simplified_language",
  description: "Show or remove plain-language explanations for complex page text.",
  parameters: z.object({
    enabled: z.boolean().describe("true to enable simplified language, false to disable it."),
  }),
  execute: async ({ enabled }) => {
    return await forwardToFrontend("toggle_simplified_language", { enabled });
  },
});

// ---- Tool: switch_tab ----
const switchTab = llm.tool({
  name: "switch_tab",
  description:
    'Switch which of the extension side panel\'s 3 navbar sections is active. Handled entirely in the side panel; never sent to the content script.',
  parameters: z.object({
    tab: z
      .enum(["accessibility", "form_filler", "meet_asl"])
      .describe(
        'Which side panel tab to show: "accessibility", "form_filler", or "meet_asl".'
      ),
  }),
  execute: async ({ tab }) => {
    return await forwardToFrontend("switch_tab", { tab });
  },
});

// ---- Tool: explain_element ----
const explainElement = llm.tool({
  name: "explain_element",
  description: "Explain what a visible page element or form field is for in plain language.",
  parameters: z.object({
    elementId: z.string().optional().describe("Known page element ID, if available."),
    label: z.string().describe("Visible label or description of the element."),
  }),
  execute: async ({ elementId, label }) => {
    return await forwardToFrontend("explain_element", { elementId, label });
  },
});

// ---- Tool: submit_form ----
const submitForm = llm.tool({
  name: "submit_form",
  description: "Submit the current page form, optionally targeting a specific submit button.",
  parameters: z.object({
    submitButtonId: z.string().optional().describe("Known submit button ID, if available."),
  }),
  execute: async ({ submitButtonId }) => {
    return await forwardToFrontend("submit_form", { submitButtonId });
  },
});

// ---- Tool: search_product ----
const searchProduct = llm.tool({
  name: "search_product",
  description: "Find a product on the current shopping page by name or description.",
  parameters: z.object({
    query: z.string().describe("Product name or search description."),
  }),
  execute: async ({ query }) => {
    return await forwardToFrontend("search_product", { query });
  },
});

// ---- Tool: add_to_cart ----
const addToCart = llm.tool({
  name: "add_to_cart",
  description: "Add a matching product on the current shopping page to the cart.",
  parameters: z.object({
    query: z.string().describe("Product name or description to add."),
    quantity: z.number().int().positive().optional().describe("Number of items to add."),
  }),
  execute: async ({ query, quantity }) => {
    return await forwardToFrontend("add_to_cart", { query, quantity });
  },
});

// ---- Tool: extract_products ----
const extractProducts = llm.tool({
  name: "extract_products",
  description: "Read the products currently visible on the shopping page.",
  parameters: z.object({}),
  execute: async () => {
    return await forwardToFrontend("extract_products", {});
  },
});

// ---- Create the agent ----
export function createAgent() {
  return voice.Agent.create({
    instructions: SYSTEM_PROMPT,
    tools: [
      describePage,
      readElement,
      fillFormField,
      simplifyQuestion,
      toggleHighContrast,
      toggleLargeText,
      toggleDyslexiaFont,
      toggleSimplifiedLanguage,
      switchTab,
      explainElement,
      submitForm,
      searchProduct,
      addToCart,
      extractProducts,
    ],
  });
}