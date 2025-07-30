import { MongoClient, Db } from "mongodb";

const uri =
  "mongodb+srv://anshika-sharma:Pulsar420@cluster0.8yb6csk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!uri) {
  throw new Error("MongoDB URI is missing");
}

const client = new MongoClient(uri);
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db("vscode-tracker");
    console.log("✅ Connected to MongoDB");
  }
  return db;
}
