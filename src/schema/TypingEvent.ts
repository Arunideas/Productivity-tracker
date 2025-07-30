import { z } from "zod";

export const typingEventSchema = z.object({
  type: z.literal("typing"),
  languageId: z.string(),
  characters: z.number(),
  words: z.number(),
  lines: z.number(),
  timestamp: z.string().datetime(),
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
  name: z.string(),
  action: z.enum(["install", "uninstall"]),
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
