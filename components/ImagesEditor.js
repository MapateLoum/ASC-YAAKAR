"use client";

import { useState } from "react";
import { compressImage } from "@/lib/compressImage";

export default function ImagesEditor({ defaultImages = [] }) {
  const [kept, setKept] = useState(defaultImages);
  const [newPreviews, setNewPreviews] = useState([]);
  const [compressing, setCompressing] = useState(false);

  function removeExisting(url) {
    setKept(kept.filter((u) => u !== url));
  }

  async function handleFileChange(e) {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) {
      setNewPreviews([]);
      return;
    }

    setCompressing(true);
    const compressed = await Promise.all(files.map((f) => compressImage(f)));

    const dt = new DataTransfer();
    compressed.forEach((f) => dt.items.add(f));
    input.files = dt.files;

    setNewPreviews(
      compressed.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
    );
    setCompressing(false);
  }

  return (
    <div className="col-span-full">
      <p className="mb-2 text-sm text-bone-dim">Photos</p>

      {kept.length > 0 && (
        <>
          <p className="mb-1 text-xs text-bone-dim/70">Déjà en ligne :</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {kept.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt=""
                  className="h-20 w-20 rounded-md border border-charcoal-line object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-red-900 bg-ink text-[10px] text-red-400 hover:bg-red-950"
                  title="Retirer cette photo"
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
        name="images"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mt-1 w-full min-w-0 max-w-full box-border rounded-md border border-charcoal-line bg-ink px-3 py-2 text-sm text-bone outline-none file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-ink focus:border-gold"
      />
      <p className="mt-1 text-xs text-bone-dim/70">
        Tu peux sélectionner plusieurs photos à la fois. Elles sont compressées automatiquement,
        puis s&apos;ajoutent à celles déjà en ligne.
      </p>

      {compressing && (
        <p className="mt-2 text-xs text-gold-bright">Compression des photos…</p>
      )}

      {!compressing && newPreviews.length > 0 && (
        <>
          <p className="mt-3 mb-1 text-xs text-bone-dim/70">
            Nouvelles photos sélectionnées ({newPreviews.length}) :
          </p>
          <div className="flex flex-wrap gap-2">
            {newPreviews.map((p, i) => (
              <img
                key={i}
                src={p.url}
                alt={p.name}
                className="h-20 w-20 rounded-md border border-gold object-cover"
              />
            ))}
          </div>
        </>
      )}

      <input type="hidden" name="existingImages" value={JSON.stringify(kept)} />
    </div>
  );
}