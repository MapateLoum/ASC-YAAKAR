"use client";

import { useState } from "react";
import { compressImage } from "@/lib/compressImage";

export default function PhotoInput({ defaultPhoto = "" }) {
  const [preview, setPreview] = useState(null);
  const [compressing, setCompressing] = useState(false);

  async function handleChange(e) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }

    setCompressing(true);
    const compressed = await compressImage(file);

    const dt = new DataTransfer();
    dt.items.add(compressed);
    input.files = dt.files;

    setPreview(URL.createObjectURL(compressed));
    setCompressing(false);
  }

  return (
    <>
      {preview ? (
        <img
          src={preview}
          alt=""
          className="mt-1 mb-2 h-20 w-20 rounded-md border border-gold object-cover"
        />
      ) : (
        defaultPhoto && (
          <img
            src={defaultPhoto}
            alt=""
            className="mt-1 mb-2 h-20 w-20 rounded-md object-cover"
          />
        )
      )}
      <input type="hidden" name="existingPhoto" defaultValue={defaultPhoto || ""} />
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
        className="mt-1 w-full min-w-0 max-w-full box-border rounded-md border border-charcoal-line bg-ink px-3 py-2 text-sm text-bone outline-none file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-ink focus:border-gold"
      />
      {compressing && (
        <p className="mt-1 text-xs text-gold-bright">Compression de la photo…</p>
      )}
    </>
  );
}