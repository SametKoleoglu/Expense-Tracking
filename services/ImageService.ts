import { ResponseType } from "@/types";
import axios from "axios";

let URL =
  (((process.env.EXPO_PUBLIC_CLOUDINARY_URL as string) +
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME) as string) + "/image/upload";

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: false, data: null };
    if (typeof file == "string") {
      return { success: true, data: file };
    }

    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri?.split("/").pop() || "file.jpg",
      } as any);

      formData.append(
        "upload_preset",
        process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
      );
      formData.append("folder", folderName);

      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response?.data?.secure_url };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, msg: error?.message || "could not upload image" };
  }
};
export const getProfileImage = (profileImage: any) => {
  if (profileImage && typeof profileImage === "string") return profileImage;
  if (profileImage && typeof profileImage === "object") return profileImage.uri;

  return require("../assets/images/defaultAvatar.png");
};

export const getFilePath = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;

  return null;
};
