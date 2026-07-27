import api from "../api";
import { resolveUploadEntries } from "./uploadHelpers.js";

export const uploadFileToS3 = async ({ file, folder = "uploads" }) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const uploadFilesToS3 = async ({ files, folder = "products" }) => {
  return resolveUploadEntries({
    files,
    folder,
    uploadFile: async (file, currentFolder) => uploadFileToS3({ file, folder: currentFolder }),
  });
};
