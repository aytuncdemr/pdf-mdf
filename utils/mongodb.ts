import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error(
        "Please define the MONGO_URI environment variable inside .env.local"
    );
}

const client = new MongoClient(MONGO_URI);

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectMongoDB() {
    if (!cachedClient || !cachedDb) {
        await client.connect();
        cachedClient = client;
        cachedDb = client.db("pdf-mdf");
    }

    const users = cachedDb.collection("users");
    const pdfs = cachedDb.collection("pdfs");
    const raports = cachedDb.collection("raports");

    return { db: cachedDb, users, pdfs, client: cachedClient, raports };
}
