import { NextApiRequest, NextApiResponse } from "next";
import {
  typingEventSchema,
  fileEventSchema,
  terminalEventSchema,
  mouseEventSchema,
  extensionEventSchema,
  copyPasteEventSchema,
  idleEventSchema,
} from "./../../schema/TypingEvent"; // Make sure this path is correct

const eventSchemas = [
  typingEventSchema,
  fileEventSchema,
  terminalEventSchema,
  mouseEventSchema, 
  extensionEventSchema,
  copyPasteEventSchema,
  idleEventSchema,
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // Try all schemas until one matches
    for (const schema of eventSchemas) {
      const result = schema.safeParse(body);
      if (result.success) {
        console.log("Received valid event:", result.data);
        return res.status(200).json({ message: "Event received" });
      }
    }

    return res.status(400).json({ error: "Invalid event format" });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
