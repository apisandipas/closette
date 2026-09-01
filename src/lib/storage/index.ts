import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  type AllowedImageType,
} from "./constants";

const bucket = process.env.B2_BUCKET!;

// B2 speaks the S3 API, so the AWS client works once it is pointed at the
// bucket's regional endpoint instead of AWS.
export const s3 = new S3Client({
  region: process.env.B2_REGION!,
  endpoint: process.env.B2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
});

export function presignUpload(key: string, contentType: AllowedImageType) {
  return getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 },
  );
}

// Rounding the signing clock down to the hour makes the same key produce the
// same URL for an hour, so the browser can cache the image instead of
// refetching it every render. Two hour window means a URL handed out at :59
// still has an hour of life left.
export function presignDownload(key: string) {
  const hour = 3_600_000;
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: 7200,
    signingDate: new Date(Math.floor(Date.now() / hour) * hour),
  });
}

// B2 has no presigned POST policies, so size cannot be capped in the signature.
// Check the stored object before trusting a key enough to write it to the db.
export async function verifyUpload(key: string) {
  try {
    const head = await s3.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );

    const size = head.ContentLength ?? 0;
    const type = head.ContentType ?? "";

    if (size === 0 || size > MAX_IMAGE_BYTES) return null;
    if (!ALLOWED_IMAGE_TYPES.includes(type as AllowedImageType)) return null;

    return { size, type: type as AllowedImageType };
  } catch {
    return null;
  }
}

export async function deleteImage(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
