import dotenv from "dotenv"
import { MongoClient } from "mongodb"

dotenv.config()

// Conexão DB

const mongoClient = new MongoClient(process.env.DATABASE_URL);

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))


export const db = mongoClient.db()