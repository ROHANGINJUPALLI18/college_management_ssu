export async function uploadStudentPhotoFileToCloudinary(
  selectedPhotoFile: File,
): Promise<string> {
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//   const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESE
  const cloudinaryUnsignedUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudinaryCloudName || !cloudinaryUnsignedUploadPreset) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const uploadFormData = new FormData();
  uploadFormData.append("file", selectedPhotoFile);
  uploadFormData.append("upload_preset", cloudinaryUnsignedUploadPreset);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: uploadFormData,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error("Unable to upload student photo to Cloudinary.");
  }

  const uploadResponseBody = (await uploadResponse.json()) as {
    secure_url?: string;
  };

  if (!uploadResponseBody.secure_url) {
    throw new Error("Cloudinary upload response does not include secure_url.");
  }

  return uploadResponseBody.secure_url;
}
