import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  // On build/dev without env set yet, don't crash the module load.
  console.warn("MONGODB_URI n'est pas défini. Ajoute-le dans .env.local");
}

if (process.env.NODE_ENV === "development") {
  // En dev, on garde la connexion en cache pour éviter d'en ouvrir une nouvelle
  // à chaque hot-reload.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db("asc_yaakar");
}

export default clientPromise;
