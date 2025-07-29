//saveClipboardEvent.ts
import { connectToDatabase } from "../utils/mongoClient";

interface ClipboardEvent {
  content: string;
  timestamp: number;
  source: string;
}

export async function saveClipboardEvent(event: ClipboardEvent) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("clipboard-events");

    const result = await collection.insertOne(event);
    console.log("✅ Clipboard event saved:", result.insertedId);
  } catch (error) {
    console.error("❌ Error saving clipboard event:", error);
  }
}
