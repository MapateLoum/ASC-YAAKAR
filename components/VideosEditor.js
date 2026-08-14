"use client";

import { useState } from "react";

const MAX_VIDEOS = 2;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "portfolio_upload";

function uploadVideoToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error(result?.error?.message || "Échec de l'upload vidéo."));
        }
      } catch {
        reject(new Error("Réponse Cloudinary invalide."));
      }
    };

    xhr.onerror = () => reject(new Error("Erreur réseau pendant l'upload."));

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    xhr.send(form);
  });
}

export default function VideosEditor({ defaultVideos = [] }) {
  const [kept, setKept] = useState(defaultVideos);
  const [uploaded, setUploaded] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState("");

  function removeExisting(url) {
    setKept(kept.filter((u) => u !== url));
  }

  function removeUploaded(url) {
    setUploaded(uploaded.filter((u) => u !== url));
  }

  async function handleFileChange(e) {
    const input = e.target;
    const files = Array.from(input.files || []);
    input.value = "";

    if (files.length === 0) return;

    const totalAfter = kept.length + uploaded.length + files.length;
    if (totalAfter > MAX_VIDEOS) {
      setError(`Maximum ${MAX_VIDEOS} vidéos au total.`);
      return;
    }

    if (!CLOUD_NAME) {
      setError(
        "Configuration manquante : NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME n'est pas définie."
      );
      return;
    }

    setError("");
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgressLabel(`Envoi vidéo ${i + 1}/${files.length}…`);
      try {
        const url = await uploadVideoToCloudinary(file, (pct) => {
          setProgressLabel(`Envoi vidéo ${i + 1}/${files.length} — ${pct}%`);
        });
        setUploaded((prev) => [...prev, url]);
      } catch (err) {
        setError(err.message || "Échec de l'upload d'une vidéo.");
      }
    }

    setProgressLabel("");
    setUploading(false);
  }

  return (
    <div className="col-span-full">
      <p className="mb-2 text-sm text-bone-dim">Vidéos (2 maximum)</p>

      {kept.length > 0 && (
        <>
          <p className="mb-1 text-xs text-bone-dim/70">Déjà en ligne :</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {kept.map((url) => (
              <div key={url} className="relative">
                <video
                  src={url}
                  className="h-24 w-40 rounded-md border border-charcoal-line object-cover"
                  controls
                />
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-red-900 bg-ink text-[10px] text-red-400 hover:bg-red-950"
                  title="Retirer cette vidéo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <input
        type="file"
        accept="video/*"
        multiple
        disabled={uploading}
        onChange={handleFileChange}
        className="mt-1 w-full min-w-0 max-w-full box-border rounded-md border border-charcoal-line bg-ink px-3 py-2 text-sm text-bone outline-none file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-ink focus:border-gold disabled:opacity-50"
      />
      <p className="mt-1 text-xs text-bone-dim/70">
        Les vidéos s&apos;envoient directement en ligne dès la sélection ({MAX_VIDEOS} maximum
        au total).
      </p>

      {uploading && (
        <p className="mt-2 text-xs text-gold-bright">
          {progressLabel || "Envoi en cours…"}
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      {uploaded.length > 0 && (
        <>
          <p className="mt-3 mb-1 text-xs text-bone-dim/70">
            Nouvelles vidéos envoyées ({uploaded.length}) :
          </p>
          <div className="flex flex-wrap gap-2">
            {uploaded.map((url) => (
              <div key={url} className="relative">
                <video
                  src={url}
                  className="h-24 w-40 rounded-md border border-gold object-cover"
                  controls
                />
                <button
                  type="button"
                  onClick={() => removeUploaded(url)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-red-900 bg-ink text-[10px] text-red-400 hover:bg-red-950"
                  title="Retirer cette vidéo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <input type="hidden" name="existingVideos" value={JSON.stringify(kept)} />
      <input type="hidden" name="newVideoUrls" value={JSON.stringify(uploaded)} />
    </div>
  );
}