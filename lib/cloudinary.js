async function uploadToCloudinary(file, resourceType) {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  console.log(`=== CLOUDINARY UNSIGNED UPLOAD (${resourceType}) ===`);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = "portfolio_upload";

  console.log("Cloud name:", cloudName);
  console.log("Upload preset:", uploadPreset);

  const buffer = Buffer.from(await file.arrayBuffer());

  const form = new FormData();

  form.append(
    "file",
    new Blob([buffer], {
      type: file.type || "application/octet-stream",
    }),
    file.name
  );

  form.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const result = await response.json();

  console.log("Cloudinary HTTP:", response.status);
  console.log("Cloudinary response:", result);

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        `Cloudinary upload failed: ${response.status}`
    );
  }

  return result.secure_url;
}

/* ---------------- IMAGES ---------------- */

export async function uploadImage(file) {
  return uploadToCloudinary(file, "image");
}

export async function uploadImages(files) {
  if (!files || files.length === 0) return [];

  const results = await Promise.all(
    files.map((f) =>
      uploadImage(f).catch((err) => {
        console.log("DEBUG erreur upload image:", err.message || err);
        return null;
      })
    )
  );

  return results.filter(Boolean);
}

/* ---------------- VIDEOS ---------------- */

export async function uploadVideo(file) {
  return uploadToCloudinary(file, "video");
}

export async function uploadVideos(files) {
  if (!files || files.length === 0) return [];

  const results = await Promise.all(
    files.map((f) =>
      uploadVideo(f).catch((err) => {
        console.log("DEBUG erreur upload video:", err.message || err);
        return null;
      })
    )
  );

  return results.filter(Boolean);
}