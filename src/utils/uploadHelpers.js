export const normalizeUploadEntries = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
};

export const resolveUploadEntries = async ({
  files,
  uploadFile,
  folder = "products",
}) => {
  const values = normalizeUploadEntries(files);

  const resolved = [];

  for (const entry of values) {
    if (typeof entry === "string") {
      resolved.push(entry);
      continue;
    }

    if (entry && typeof entry === "object") {
      const uploaded = await uploadFile(entry, folder);
      resolved.push(uploaded?.url || uploaded?.data?.url || "");
    }
  }

  return resolved.filter(Boolean);
};
