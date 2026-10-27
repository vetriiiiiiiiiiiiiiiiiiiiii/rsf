import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./db";

const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

type Detected = { mime: string; ext: string; kind: "IMAGE" | "DOCUMENT" };

/** Identify a file by its leading bytes rather than trusting the browser-supplied type. */
export function sniff(buf: Buffer): Detected | null {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: "image/png", ext: "png", kind: "IMAGE" };
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg", kind: "IMAGE" };
  }
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return { mime: "image/webp", ext: "webp", kind: "IMAGE" };
  }
  if (buf.length >= 5 && buf.toString("ascii", 0, 5) === "%PDF-") {
    return { mime: "application/pdf", ext: "pdf", kind: "DOCUMENT" };
  }
  return null;
}

/** Read pixel dimensions from PNG, JPEG and WebP headers. */
export function imageSize(buf: Buffer, mime: string): { width: number; height: number } | null {
  try {
    if (mime === "image/png") return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (mime === "image/webp") {
      const chunk = buf.toString("ascii", 12, 16);
      if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (chunk === "VP8L") {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
      if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
      return null;
    }
    if (mime === "image/jpeg") {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) return null;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export class UploadError extends Error {}

// Uploads live outside the build; tell the bundler not to trace this directory.
function uploadDir() {
  return path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "./storage/uploads");
}

export async function storeUpload(
  file: File,
  opts: { accept: "image" | "document" | "any"; isPublic: boolean; alt?: string },
) {
  if (file.size === 0) throw new UploadError("The selected file is empty.");
  const buf = Buffer.from(await file.arrayBuffer());
  const detected = sniff(buf);
  if (!detected) throw new UploadError("Unsupported file type. Use PNG, JPEG, WebP or PDF.");
  if (opts.accept === "image" && detected.kind !== "IMAGE") throw new UploadError("Please upload a PNG, JPEG or WebP image.");
  if (opts.accept === "document" && detected.kind !== "DOCUMENT") throw new UploadError("Please upload a PDF document.");
  const max = detected.kind === "IMAGE" ? IMAGE_MAX_BYTES : DOCUMENT_MAX_BYTES;
  if (buf.length > max) throw new UploadError(`File is too large (maximum ${max / 1024 / 1024} MB).`);

  const storageKey = `${randomBytes(16).toString("hex")}.${detected.ext}`;
  await mkdir(/*turbopackIgnore: true*/ uploadDir(), { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ uploadDir(), storageKey), buf, { flag: "wx" });

  const dims = detected.kind === "IMAGE" ? imageSize(buf, detected.mime) : null;
  return db.mediaAsset.create({
    data: {
      storageKey,
      originalName: file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || storageKey,
      mimeType: detected.mime,
      size: buf.length,
      width: dims?.width,
      height: dims?.height,
      alt: opts.alt?.slice(0, 200) ?? "",
      kind: detected.kind,
      isPublic: opts.isPublic,
    },
  });
}

export async function readUpload(storageKey: string) {
  // storageKey is generated server-side; guard against traversal regardless.
  if (!/^[a-f0-9]{32}\.(png|jpg|webp|pdf)$/.test(storageKey)) throw new UploadError("Invalid key");
  return readFile(path.join(/*turbopackIgnore: true*/ uploadDir(), storageKey));
}

export async function deleteUpload(id: string) {
  const asset = await db.mediaAsset.delete({ where: { id } });
  await unlink(path.join(/*turbopackIgnore: true*/ uploadDir(), asset.storageKey)).catch(() => undefined);
  return asset;
}
