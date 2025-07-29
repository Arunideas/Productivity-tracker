import { connectToDatabase } from "./mongoClient";

import {
  typingEventSchema,
  fileEventSchema,
  terminalEventSchema,
  mouseEventSchema,
  extensionEventSchema,
  copyPasteEventSchema,
  idleEventSchema,
} from "./eventSchemas";

// All event schemas to validate against
const eventSchemas = [
  typingEventSchema,
  fileEventSchema,
  terminalEventSchema,
  mouseEventSchema,
  extensionEventSchema,
  copyPasteEventSchema,
  idleEventSchema,
];

console.log("🟡 saveEvent.ts loaded");

export async function saveEvent(event: any) {
  let validatedEvent: any = null;

  // Try validating against schemas
  for (const schema of eventSchemas) {
    const result = schema.safeParse(event);
    if (result.success) {
      validatedEvent = result.data;
      break;
    }
  }

  if (!validatedEvent) {
    console.error("❌ Invalid event format:", event);
    return;
  }

  console.log("🟢 Validated event, inserting:", validatedEvent);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("activity_logs");

    const insertResult = await collection.insertOne(validatedEvent);

    if (!insertResult.acknowledged) {
      console.error("❌ MongoDB insert NOT acknowledged:", validatedEvent);
    } else {
      console.log(`✅ Saved event to 'activity_logs':`, validatedEvent);
      console.log("📥 Mongo Insert Result:", insertResult);
    }
  } catch (err: any) {
    console.error("❌ MongoDB insert failed:", err.message);
    console.error(err.stack);
  }
}

// TEMP TEST — you can comment this out after verifying
saveEvent({
  type: "typing",
  languageId: "typescript",
  characters: 80,
  words: 16,
  lines: 3,
  timestamp: new Date().toISOString(),
  userId: "test-user",
  ipAddress: "127.0.0.1",
  filePath: "/Users/you/test.ts",
  lineNumbers: [0, 1],
  wordCount: 16,
  lineCount: 3,
});
