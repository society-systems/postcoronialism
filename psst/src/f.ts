import crypto from "crypto";

export function toHexString(i: Uint8Array) {
  return Buffer.from(i).toString("hex");
}

export function sha256(data: crypto.BinaryLike) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}
