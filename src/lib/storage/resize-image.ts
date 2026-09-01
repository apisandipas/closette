import { MAX_IMAGE_EDGE } from "@/lib/storage/constants";

export async function resizeToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    1,
    MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that image");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  if (!blob) throw new Error("Could not read that image");

  return blob;
}
