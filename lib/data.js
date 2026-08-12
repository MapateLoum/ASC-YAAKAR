import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

function serialize(doc) {
  if (!doc) return doc;
  return { ...doc, _id: doc._id.toString() };
}

function serializeAll(docs) {
  return docs.map(serialize);
}

/* ---------------- ADMIN ---------------- */

export async function getAdminByEmail(email) {
  const db = await getDb();
  const admin = await db
    .collection("admins")
    .findOne({ email: email.toLowerCase().trim() });
  return serialize(admin);
}

export async function createAdmin(email, passwordHash) {
  const db = await getDb();
  const res = await db.collection("admins").insertOne({
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date(),
  });
  return res.insertedId.toString();
}

/* ---------------- MATCHS ---------------- */

export async function getAllMatches() {
  const db = await getDb();
  const matches = await db
    .collection("matches")
    .find({})
    .sort({ date: 1 })
    .toArray();
  return serializeAll(matches);
}

export async function getNextMatch() {
  const db = await getDb();
  const match = await db
    .collection("matches")
    .find({ status: "a_venir" })
    .sort({ date: 1 })
    .limit(1)
    .toArray();
  return serialize(match[0]);
}

export async function getLastResult() {
  const db = await getDb();
  const match = await db
    .collection("matches")
    .find({ status: "termine" })
    .sort({ date: -1 })
    .limit(1)
    .toArray();
  return serialize(match[0]);
}

export async function addMatch(data) {
  const db = await getDb();
  const res = await db.collection("matches").insertOne({
    adversaire: data.adversaire,
    domicile: data.domicile === "true" || data.domicile === true,
    date: data.date,
    lieu: data.lieu || "",
    status: data.status || "a_venir",
    score_yaakar: data.score_yaakar !== "" ? Number(data.score_yaakar) : null,
    score_adverse: data.score_adverse !== "" ? Number(data.score_adverse) : null,
    poule: data.poule || "",
    createdAt: new Date(),
  });
  return res.insertedId.toString();
}

export async function updateMatch(id, data) {
  const db = await getDb();
  await db.collection("matches").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        adversaire: data.adversaire,
        domicile: data.domicile === "true" || data.domicile === true,
        date: data.date,
        lieu: data.lieu || "",
        status: data.status,
        score_yaakar:
          data.score_yaakar !== "" && data.score_yaakar !== undefined
            ? Number(data.score_yaakar)
            : null,
        score_adverse:
          data.score_adverse !== "" && data.score_adverse !== undefined
            ? Number(data.score_adverse)
            : null,
        poule: data.poule || "",
      },
    }
  );
}

export async function deleteMatch(id) {
  const db = await getDb();
  await db.collection("matches").deleteOne({ _id: new ObjectId(id) });
}

/* ---------------- JOUEURS ---------------- */

export async function getAllPlayers() {
  const db = await getDb();
  const players = await db
    .collection("players")
    .find({})
    .sort({ numero: 1 })
    .toArray();
  return serializeAll(players);
}

export async function addPlayer(data) {
  const db = await getDb();
  const res = await db.collection("players").insertOne({
    nom: data.nom,
    poste: data.poste,
    numero: data.numero ? Number(data.numero) : null,
    photo: data.photo || "",
    bio: data.bio || "",
    createdAt: new Date(),
  });
  return res.insertedId.toString();
}

export async function updatePlayer(id, data) {
  const db = await getDb();
  await db.collection("players").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        nom: data.nom,
        poste: data.poste,
        numero: data.numero ? Number(data.numero) : null,
        photo: data.photo || "",
        bio: data.bio || "",
      },
    }
  );
}

export async function deletePlayer(id) {
  const db = await getDb();
  await db.collection("players").deleteOne({ _id: new ObjectId(id) });
}

/* ---------------- ACTUS ---------------- */

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllNews() {
  const db = await getDb();
  const news = await db
    .collection("news")
    .find({})
    .sort({ date: -1 })
    .toArray();
  return serializeAll(news);
}

export async function getNewsBySlug(slug) {
  const db = await getDb();
  const item = await db.collection("news").findOne({ slug });
  return serialize(item);
}

export async function addNews(data) {
  const db = await getDb();
  const res = await db.collection("news").insertOne({
    titre: data.titre,
    slug: toSlug(data.titre) + "-" + Date.now().toString(36),
    resume: data.resume || "",
    contenu: data.contenu || "",
    image: data.image || "",
    date: new Date().toISOString(),
    createdAt: new Date(),
  });
  return res.insertedId.toString();
}

export async function updateNews(id, data) {
  const db = await getDb();
  await db.collection("news").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        titre: data.titre,
        resume: data.resume || "",
        contenu: data.contenu || "",
        image: data.image || "",
      },
    }
  );
}

export async function deleteNews(id) {
  const db = await getDb();
  await db.collection("news").deleteOne({ _id: new ObjectId(id) });
}
