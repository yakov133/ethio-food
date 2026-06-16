const { MongoClient } = require("mongodb");

require("dotenv").config();

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB_NAME || "ethyopianfood";

let client;
let dbPromise;

function getDb() {
  if (!url) {
    throw new Error("MONGODB_URL is not configured");
  }

  // Cache one connection promise so every request reuses the same Mongo client.
  if (!dbPromise) {
    client = new MongoClient(url);
    dbPromise = client.connect().then(() => client.db(dbName)).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }

  return dbPromise;
}

async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    dbPromise = null;
  }
}

module.exports = {
  getDb,
  closeDb,
};
