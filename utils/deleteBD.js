import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const BD_CONNECTION = process.env.BD_CONNETION;
const BD = process.env.BD;
const client = new MongoClient(BD);

async function dropDatabase() {
  try {
    await client.connect();
    const db = client.db(BD_CONNECTION);
    await db.dropDatabase();
    console.log(`Base de datos ${BD_CONNECTION} eliminada.`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

dropDatabase();
