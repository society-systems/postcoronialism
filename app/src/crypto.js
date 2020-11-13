import nacl from "tweetnacl";
import { Buffer } from "buffer";

export function uint8ArrayToHexString(i) {
  return Buffer.from(i).toString("hex");
}

export function hexStringToUint8Array(s) {
  return Uint8Array.from(Buffer.from(s, "hex"));
}

export function uint32toUint8Array(n) {
  if (n < 0 || n >= 2 ** 32) {
    throw new RangeError("Number should be between 0 and 4294967296");
  }
  return Uint8Array.from([
    (n >> 24) & 0xff,
    (n >> 16) & 0xff,
    (n >> 8) & 0xff,
    n & 0xff,
  ]);
}

export function uint8ArrayToUint32(a) {
  if (a.length !== 4) {
    throw new RangeError("Array should have 4 bytes");
  }
  // Bitwise operations convert the number to a 32-bit signed int,
  // so we need to go back to an unsigned representation by using
  // the unsigned shift operator `>>>`.
  return ((a[0] << 24) | (a[1] << 16) | (a[2] << 8) | a[3]) >>> 0;
}

export function invite(secretKey, isAdmin, expiry) {
  const { publicKey } = nacl.sign.keyPair.fromSecretKey(secretKey);
  const nonce = nacl.randomBytes(32);
  const roleByte = Uint8Array.from([isAdmin ? 1 : 0]);
  const expiryBytes = uint32toUint8Array(Math.floor(expiry.getTime() / 1000));
  // For whatever reason the buffer shim doesn't recognize
  // native Uint8Array as a Buffer, so we call Buffer again
  const message = Buffer.concat(
    [nonce, roleByte, expiryBytes].map(Buffer.from)
  );
  const signature = nacl.sign.detached(message, secretKey);
  return Uint8Array.from(
    Buffer.concat([message, signature, publicKey].map(Buffer.from))
  );
}

export function getSignerFromInvite(invite) {
  return invite.substr(invite.length - 64);
}

export function generateDeterministicSeed(mnemonic, path = "") {
  const textSeed = mnemonic + path;
  const byteSeed = new TextEncoder().encode(textSeed);
  return nacl.hash(byteSeed).slice(0, 32);
}
