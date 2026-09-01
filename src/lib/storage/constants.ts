export const ALLOWED_IMAGE_TYPES = [
  "image/webp",
  "image/jpeg",
  "image/png",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const MAX_IMAGE_EDGE = 1600;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const EXTENSIONS: Record<AllowedImageType, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Keys are prefixed by user so ownership is checkable without a db round trip.
export function buildImageKey(userId: string, contentType: AllowedImageType) {
  return `u/${userId}/${crypto.randomUUID()}.${EXTENSIONS[contentType]}`;
}

export function ownsKey(userId: string, key: string) {
  return key.startsWith(`u/${userId}/`);
}
