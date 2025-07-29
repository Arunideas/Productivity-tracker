import { z } from "zod";

// utils/eventSchemas.ts
export const typingEventSchema = z.object({
  type: z.literal("typing"),
  languageId: z.string(),
  characters: z.number(),
  words: z.number(),
  lines: z.number(),
  timestamp: z.string(),
  userId: z.string(),
  ipAddress: z.string(),
  filePath: z.string(),
  lineNumbers: z.array(z.number()),
  wordCount: z.number(),
  lineCount: z.number(),
});

export const fileEventSchema = z.object({
  type: z.literal("file"),
  operation: z.enum(["create", "delete", "rename", "open", "close", "save"]),
  filePath: z.string(),
  timestamp: z.string().datetime(),
});

export const terminalEventSchema = z.object({
  type: z.literal("terminal"),
  command: z.string(),
  timestamp: z.string().datetime(),
});

export const mouseEventSchema = z.object({
  type: z.literal("mouse"),
  action: z.string(),
  fileName: z.string(),
  line: z.number(),
  character: z.number(),
  timestamp: z.string().datetime(),
});

export const extensionEventSchema = z.object({
  type: z.literal("extension"),
  operation: z.enum(["install", "uninstall"]), // 🔁 updated from 'action' to 'operation'
  extensionId: z.string(),                     // 🔁 updated from 'name' to 'extensionId'
  timestamp: z.string().datetime(),
});

export const copyPasteEventSchema = z.object({
  type: z.literal("copyPaste"),
  action: z.enum(["copy", "paste"]),
  characterCount: z.number(),
  timestamp: z.string().datetime(),
});

export const idleEventSchema = z.object({
  type: z.literal("idle"),
  durationSeconds: z.number(),
  timestamp: z.string().datetime(),
});
