import { toHexString, sha256 } from "./f";
import { Database } from "better-sqlite3";
import nacl from "tweetnacl";

export enum USER_ROLE {
  ADMIN,
  MEMBER,
}

const SQL_USERS_CREATE = `
CREATE TABLE IF NOT EXISTS users(
  publicKey STRING PRIMARY KEY,
  role INTEGER NOT NULL,
  invite STRING NOT NULL,
  UNIQUE(invite)
)`;

const SQL_USERS_INSERT = `
INSERT INTO users (publicKey, role, invite)
VALUES ($publicKey, $role, $invite)
`;

const SQL_USERS_GET_BY_PUBLIC_KEY = `
SELECT *
FROM users
WHERE publicKey = $publicKey 
`;

const SQL_USERS_HAS_ROLE = `
SELECT COUNT(*) AS count
FROM users
WHERE publicKey = $publicKey
  AND role = $role
`;

export function create(db: Database) {
  db.prepare(SQL_USERS_CREATE).run();
}

export function verify(
  payload: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
) {
  return nacl.sign.detached.verify(payload, signature, publicKey);
}

// Generate an invite. An invite is 129 byte long and has the following form:
// nonce(32bytes) + role(1byte) + signature(64bytes) + publicKey(32bytes)
export function invite(secretKey: Uint8Array, role: USER_ROLE) {
  const { publicKey } = nacl.sign.keyPair.fromSecretKey(secretKey);
  const nonce = nacl.randomBytes(32);
  const roleByte = new Uint8Array(1);
  const message = Buffer.concat([nonce, roleByte]);
  roleByte[0] = role;
  const signature = nacl.sign.detached(message, secretKey);
  return Uint8Array.from(Buffer.concat([message, signature, publicKey]));
}

export function addUser(
  db: Database,
  publicKey: Uint8Array,
  role: USER_ROLE,
  invite: Uint8Array
) {
  const message = invite.slice(0, 33);
  const signature = invite.slice(33, 97);
  const signer = invite.slice(97, 129);

  if (!verify(message, signature, signer)) {
    throw new Error("Invalid signature");
  }

  if (!hasRole(db, signer, USER_ROLE.ADMIN)) {
    throw new Error("Invite is not signed by an admin");
  }

  db.prepare(SQL_USERS_INSERT).run({
    publicKey: toHexString(publicKey),
    role,
    invite: sha256(invite),
  });
}

export function addGenesisAdmin(db: Database, publicKey: Uint8Array) {
  db.prepare(SQL_USERS_INSERT).run({
    publicKey: toHexString(publicKey),
    role: USER_ROLE.ADMIN,
    invite: "genesis",
  });
}

export function getUser(db: Database, publicKey: Uint8Array) {
  return db
    .prepare(SQL_USERS_GET_BY_PUBLIC_KEY)
    .get({ publicKey: toHexString(publicKey) });
}

export function hasRole(db: Database, publicKey: Uint8Array, role: USER_ROLE) {
  return (
    db
      .prepare(SQL_USERS_HAS_ROLE)
      .get({ publicKey: toHexString(publicKey), role }).count === 1
  );
}
