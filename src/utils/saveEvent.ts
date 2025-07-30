import { connectToDatabase } from "./mongoClient";
import {
  typingEventSchema,
  fileEventSchema,
  terminalEventSchema,
  mouseEventSchema,
  extensionEventSchema,
  extensionUninstallEventSchema,
  copyPasteEventSchema,
  idleEventSchema
} from "./eventSchemas";

const schemas = [
  typingEventSchema,
  fileEventSchema,
  terminalEventSchema,
  mouseEventSchema,
  extensionEventSchema,
  extensionUninstallEventSchema,
  copyPasteEventSchema,
  idleEventSchema
];

console.log("🟡 saveEvent.ts loaded");

async function tryInsertWithRetry(collection: any, event: any, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await collection.insertOne(event);
      if (result.acknowledged) {
        console.log("✅ Event inserted:", event);
        return;
      } else {
        console.warn(`⚠️ Attempt ${attempt} failed (not acknowledged)`);
      }
    } catch (err: any) {
      console.error(`❌ Mongo insert attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, 100 * attempt)); // Exponential backoff
    }
  }
}

export async function saveEvent(rawEvent: any) {
  for (const schema of schemas) {
    const parsed = schema.safeParse(rawEvent);
    if (parsed.success) {
      const validated = parsed.data;

      try {
        const db = await connectToDatabase();
        const collection = db.collection("activity_logs");

        await tryInsertWithRetry(collection, validated);
        return;
      } catch (err) {
        console.error("❌ Final Mongo insert failed:", err);
      }

      return;
    }
  }

  console.error("❌ No schema matched. Invalid event:", rawEvent);
}
