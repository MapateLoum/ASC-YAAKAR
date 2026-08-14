"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession } from "@/lib/auth";
import { uploadImage, uploadImages } from "@/lib/cloudinary";
import * as data from "@/lib/data";

/* ---------------- AUTH ---------------- */

export async function loginAction(prevState, formData) {
  const email = (formData.get("email") || "").toString();
  const password = (formData.get("password") || "").toString();

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const admin = await data.getAdminByEmail(email);

  if (!admin) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);

  if (!ok) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSession();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- MATCHS ---------------- */

export async function createMatchAction(formData) {
  await data.addMatch(Object.fromEntries(formData));

  revalidatePath("/admin/dashboard");
  revalidatePath("/matchs");
  revalidatePath("/");
}

export async function updateMatchAction(id, formData) {
  await data.updateMatch(id, Object.fromEntries(formData));

  revalidatePath("/admin/dashboard");
  revalidatePath("/matchs");
  revalidatePath("/");
}

export async function deleteMatchAction(id) {
  await data.deleteMatch(id);

  revalidatePath("/admin/dashboard");
  revalidatePath("/matchs");
  revalidatePath("/");
}

/* ---------------- JOUEURS ---------------- */

export async function createPlayerAction(formData) {
  const nom = (formData.get("nom") || "").toString();
  const poste = (formData.get("poste") || "").toString();
  const numero = (formData.get("numero") || "").toString();
  const bio = (formData.get("bio") || "").toString();

  const file = formData.get("photo");

  let photo = "";

  if (file instanceof File && file.size > 0) {
    const uploadedUrl = await uploadImage(file);

    if (uploadedUrl) {
      photo = uploadedUrl;
    }
  }

  await data.addPlayer({
    nom,
    poste,
    numero,
    photo,
    bio,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/effectif");
}

export async function updatePlayerAction(id, formData) {
  const nom = (formData.get("nom") || "").toString();
  const poste = (formData.get("poste") || "").toString();
  const numero = (formData.get("numero") || "").toString();
  const bio = (formData.get("bio") || "").toString();

  const existingPhoto = (
    formData.get("existingPhoto") || ""
  ).toString();

  const file = formData.get("photo");

  let photo = existingPhoto;

  if (file instanceof File && file.size > 0) {
    const uploadedUrl = await uploadImage(file);

    if (uploadedUrl) {
      photo = uploadedUrl;
    }
  }

  await data.updatePlayer(id, {
    nom,
    poste,
    numero,
    photo,
    bio,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/effectif");
}

export async function deletePlayerAction(id) {
  await data.deletePlayer(id);

  revalidatePath("/admin/dashboard");
  revalidatePath("/effectif");
}

/* ---------------- ACTUS ---------------- */

export async function createNewsAction(formData) {
  const titre = (formData.get("titre") || "").toString();
  const resume = (formData.get("resume") || "").toString();
  const contenu = (formData.get("contenu") || "").toString();

  const files = formData
    .getAll("images")
    .filter((f) => f instanceof File && f.size > 0);

  const images = await uploadImages(files);

  await data.addNews({
    titre,
    resume,
    contenu,
    images,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/actu");
  revalidatePath("/");
}

export async function updateNewsAction(id, formData) {
  const titre = (formData.get("titre") || "").toString();
  const resume = (formData.get("resume") || "").toString();
  const contenu = (formData.get("contenu") || "").toString();

  let existingImages = [];
  try {
    existingImages = JSON.parse(formData.get("existingImages") || "[]");
  } catch {
    existingImages = [];
  }

  const files = formData
    .getAll("images")
    .filter((f) => f instanceof File && f.size > 0);

  const newImages = await uploadImages(files);

  const images = [...existingImages, ...newImages];

  await data.updateNews(id, {
    titre,
    resume,
    contenu,
    images,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/actu");
}

export async function deleteNewsAction(id) {
  await data.deleteNews(id);

  revalidatePath("/admin/dashboard");
  revalidatePath("/actu");
  revalidatePath("/");
}