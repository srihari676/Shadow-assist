/* =====================================================================
 * Access AI — LiveKit Agent (main.ts)
 * ---------------------------------------------------------------------
 * Agent server entry point. Configures the STT→LLM→TTS pipeline and
 * registers the room session handler.
 *
 * Run: pnpm dev
 * Requires: livekit-server --dev running on localhost:7880
 * ===================================================================== */

import {
  AgentSessionEventTypes,
  type JobContext,
  cli,
  ServerOptions,
  defineAgent,
  inference,
  voice,
} from "@livekit/agents";
import * as openai from "@livekit/agents-plugin-openai";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createAgent } from "./agent.js";

dotenv.config();

// ---- Environment variables (from .env or system env) ----
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.MODEL || "nvidia/nemotron-3-nano-30b-a3b:free";

export default defineAgent({
  entry: async (ctx: JobContext) => {
    console.log(`[Access AI Agent] Job received — using model: ${MODEL}`);
    console.log(`[Access AI Agent] OPENAI_API_KEY set: ${!!OPENAI_API_KEY}`);
    console.log(`[Access AI Agent] OPENROUTER_API_KEY set: ${!!OPENROUTER_API_KEY}`);
    console.log(`[Access AI Agent] Connecting to room...`);

    // ---- Connect to the room FIRST (before starting the session) ----
    await ctx.connect();
    console.log(`[Access AI Agent] Room connected. Waiting for participant audio...`);

    const room = ctx.room as any;
    room.on("connectionStateChanged", (state: string) => {
      console.log(`[Access AI Agent] ROOM CONNECTION STATE CHANGED: ${state}`);
    });
    room.on("participantConnected", (participant: { identity?: string }) => {
      console.log(`[Access AI Agent] PARTICIPANT CONNECTED: ${participant.identity}`);
    });
    room.on("participantDisconnected", (participant: { identity?: string }) => {
      console.log(`[Access AI Agent] PARTICIPANT DISCONNECTED: ${participant.identity}`);
    });
    room.on("trackSubscribed", (_track: unknown, publication: { kind?: string; source?: string }, participant: { identity?: string }) => {
      console.log(
        `[Access AI Agent] TRACK SUBSCRIBED: participant=${participant.identity} kind=${publication.kind} source=${publication.source}`,
      );
    });
    room.on("trackPublished", (publication: { kind?: string; source?: string }, participant: { identity?: string }) => {
      console.log(
        `[Access AI Agent] TRACK PUBLISHED: participant=${participant.identity} kind=${publication.kind} source=${publication.source}`,
      );
    });
    room.on("trackUnpublished", (publication: { kind?: string; source?: string }, participant: { identity?: string }) => {
      console.log(
        `[Access AI Agent] TRACK UNPUBLISHED: participant=${participant.identity} kind=${publication.kind} source=${publication.source}`,
      );
    });

    // ---- STT: OpenAI Realtime STT (has built-in VAD, no separate model needed) ----
    const stt = new openai.STT({
      model: "gpt-4o-transcribe",
      useRealtime: true,
      language: "en",
      apiKey: OPENAI_API_KEY,
    });

    // ---- LLM: OpenRouter via OpenAI Chat Completions plugin ----
    const llm = new openai.LLM({
      model: MODEL,
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OPENROUTER_API_KEY,
    });

    // ---- TTS: OpenAI TTS via plugin ----
    const tts = new openai.TTS({
      model: "tts-1",
      voice: "alloy",
      apiKey: OPENAI_API_KEY,
    });

    const vad = new inference.VAD({ model: "silero" });
    console.log(`[Access AI Agent] VAD provider: ${vad.provider}`);
    console.log(`[Access AI Agent] VAD model: ${vad.model}`);
    console.log(`[Access AI Agent] STT provider: ${stt.provider}`);
    console.log(`[Access AI Agent] STT model: ${stt.model}`);
    console.log(`[Access AI Agent] STT turn detection: ${stt.turnDetection?.type ?? "none"}`);

    // ---- Create the agent session ----
    const session = new voice.AgentSession({
      vad,
      stt,
      llm,
      tts,
    });

    // ---- Log STT events to debug audio detection ----
    session.on(AgentSessionEventTypes.UserInputTranscribed, (msg) => {
      console.log(
        `[Access AI Agent] USER INPUT TRANSCRIBED (${msg.isFinal ? "final" : "interim"}): "${msg.transcript}"`,
      );
    });
    session.on(AgentSessionEventTypes.UserTranscriptionTimeout, (msg) => {
      console.log(`[Access AI Agent] USER TRANSCRIPTION TIMEOUT: ${JSON.stringify(msg)}`);
    });
    session.on(AgentSessionEventTypes.AgentStateChanged, (msg) => {
      console.log(`[Access AI Agent] AGENT STATE CHANGED: ${JSON.stringify(msg)}`);
    });
    session.on(AgentSessionEventTypes.UserStateChanged, (msg) => {
      console.log(`[Access AI Agent] USER STATE CHANGED: ${JSON.stringify(msg)}`);
    });
    session.on(AgentSessionEventTypes.DebugMessage, (msg) => {
      console.log(`[Access AI Agent] DEBUG: ${JSON.stringify(msg)}`);
    });
    session.on(AgentSessionEventTypes.EotPrediction, (msg) => {
      console.log(`[Access AI Agent] EOT PREDICTION: ${JSON.stringify(msg)}`);
    });
    session.on(AgentSessionEventTypes.SpeechCreated, (msg) => {
      console.log(`[Access AI Agent] SPEECH CREATED: ${JSON.stringify(msg)}`);
    });

    // ---- Start the session (room is already connected) ----
    await session.start({
      agent: createAgent(),
      room: ctx.room,
    });
    console.log(`[Access AI Agent] Voice session started.`);

    // ---- Generate initial greeting ----
    await session.generateReply({
      instructions:
        "Greet the user and offer your assistance. Say something like 'Hi, I'm Access AI. How can I help you with this page?'",
    });
  },
});

// ---- Run the agent server ----
// NOTE: We intentionally do NOT set agentName here. Setting agentName
// enables "explicit dispatch" mode, which means the agent will NOT join
// rooms automatically — you'd have to specify the agent in the JWT or
// call AgentDispatch.createDispatch. By omitting agentName, the agent
// joins every room automatically (default behavior, good for dev).
cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
  })
);