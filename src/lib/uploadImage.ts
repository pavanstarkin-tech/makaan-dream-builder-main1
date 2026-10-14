import { cloudinaryConfig } from "@/lib/cloudinary";

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  if (!file) throw new Error("No file provided");
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
