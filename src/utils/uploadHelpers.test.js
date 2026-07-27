import test from "node:test";
import assert from "node:assert/strict";
import { normalizeUploadEntries, resolveUploadEntries } from "./uploadHelpers.js";

test("normalizeUploadEntries converts single values into arrays", () => {
  assert.deepEqual(normalizeUploadEntries("https://example.com/a.png"), ["https://example.com/a.png"]);
  assert.deepEqual(normalizeUploadEntries(["https://example.com/a.png", "https://example.com/b.png"]), [
    "https://example.com/a.png",
    "https://example.com/b.png",
  ]);
  assert.deepEqual(normalizeUploadEntries([]), []);
});

test("resolveUploadEntries keeps string URLs and uploads file entries", async () => {
  const uploaded = await resolveUploadEntries({
    files: ["https://example.com/a.png", { name: "photo.jpg", size: 128 }],
    uploadFile: async (file, folder) => ({ url: `https://s3.example/${folder}/${file.name}` }),
    folder: "products",
  });

  assert.deepEqual(uploaded, ["https://example.com/a.png", "https://s3.example/products/photo.jpg"]);
});
