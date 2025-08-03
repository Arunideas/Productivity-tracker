import { z } from "zod";

// User schema used in all events
const userSchema = z.object({
  id: z.string(),
  ip: z.string()
});

// ⌨️ Typing Event Schema
export const typingEventSchema = z.object({
  eventType: z.literal("typing"),
  timestamp: z.string().datetime(),
  user: userSchema,
  filePath: z.string(),
  metrics: z.object({
    languageId: z.string(),
    characters: z.number(),
    words: z.number(),
    lines: z.number(),
    lineNumbers: z.array(z.number()),
    start: z.string().datetime(),
    end: z.string().datetime(),
    durationSeconds: z.number()
  })
});

// 📋 Copy-Paste Event Schema
export const copyPasteEventSchema = z.object({
  eventType: z.literal("copyPaste"),
  timestamp: z.string().datetime(),
  user: userSchema,
  filePath: z.string().optional(),
  metrics: z.object({
    action: z.enum(["copy", "paste"]),
    characterCount: z.number()
  })
});

// 📁 File Event Schema
export const fileEventSchema = z.object({
  eventType: z.literal("file"),
  timestamp: z.string().datetime(),
  user: userSchema,
  filePath: z.string(),
  metrics: z.object({
    operation: z.enum(["open", "close", "save"])
  })
});

// 💻 Terminal Event Schema
export const terminalEventSchema = z.object({
  eventType: z.literal("terminal"),
  timestamp: z.string().datetime(),
  user: userSchema,
  metrics: z.object({
    command: z.string()
  })
});

// 🖱️ Mouse Event Schema
export const mouseEventSchema = z.object({
  eventType: z.literal("mouse"),
  timestamp: z.string().datetime(),
  user: userSchema,
  filePath: z.string(),
  metrics: z.object({
    x: z.number(),
    y: z.number(),
    context: z.string(),
    start: z.string().datetime(),
    end: z.string().datetime(),
    durationSeconds: z.number()
  })
});

// 💤 Idle Event Schema
export const idleEventSchema = z.object({
  eventType: z.literal("idle"),
  timestamp: z.string().datetime(),
  user: userSchema,
  metrics: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
    durationSeconds: z.number()
  })
});

// 🧩 Extension Install Event Schema
export const extensionEventSchema = z.object({
  eventType: z.literal("extensionInstall"),
  timestamp: z.string().datetime(),
  user: userSchema,
  metrics: z.object({
    extensionId: z.string(),
    version: z.string()
  })
});

// 🧩 Extension Uninstall Event Schema
export const extensionUninstallEventSchema = z.object({
  eventType: z.literal("extensionUninstall"),
  timestamp: z.string().datetime(),
  user: userSchema,
  metrics: z.object({
    extensionId: z.string()
  })
});
// 👀 Focus Events
// 🪟 Window Focus Event Schema
export const focusEventSchema = z.object({
  eventType: z.literal("focus"),
  timestamp: z.string().datetime(),
  user: userSchema,
  metrics: z.object({
    state: z.enum(["focus", "blur"]),
    durationSeconds: z.number()
  })
});

