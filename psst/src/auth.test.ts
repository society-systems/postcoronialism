import { Database } from "better-sqlite3";
import nacl from "tweetnacl";
import {
  verify,
  addUser,
  USER_ROLE,
  hasRole,
  addGenesisAdmin,
  invite,
  verifyInvite,
} from "./auth";
import { init } from "./db";
import {
  InvalidInviteSignature,
  InvalidSignature,
  InviteExpired,
} from "./errors";

describe("Verify", () => {
  test("accepts a valid signature", () => {
    const keyPair = nacl.sign.keyPair();
    const payload = Buffer.from("come se fosse antani");
    const signature = nacl.sign.detached(payload, keyPair.secretKey);
    expect(verify(payload, signature, keyPair.publicKey)).toBeTruthy();
  });

  test("rejects an invalid signature", () => {
    const keyPair = nacl.sign.keyPair();
    const payload = Buffer.from("come se fosse antani");
    const payload2 = Buffer.from("come se fosse antani!");
    const signature = nacl.sign.detached(payload, keyPair.secretKey);
    expect(verify(payload2, signature, keyPair.publicKey)).toBeFalsy();
  });
});

describe("User management", () => {
  const adminKeyPair = nacl.sign.keyPair();
  let db: Database;

  beforeEach(() => {
    db = init();
    addGenesisAdmin(db, adminKeyPair.publicKey);
  });

  test("adds a user with a specific role", async () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    const userKeyPair = nacl.sign.keyPair();
    addUser(db, userKeyPair.publicKey, USER_ROLE.MEMBER, invitation);
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.MEMBER)).toBeTruthy();
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.ADMIN)).toBeFalsy();
  });
});

describe("Invite", () => {
  const adminKeyPair = nacl.sign.keyPair();
  let db: Database;

  beforeEach(() => {
    db = init();
    addGenesisAdmin(db, adminKeyPair.publicKey);
  });

  test("is valid if not expired", () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    expect(verifyInvite(db, invitation)).toEqual(adminKeyPair.publicKey);
  });

  test("is not valid if signature is wrong", () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    invitation[32] = USER_ROLE.ADMIN;
    expect(() => verifyInvite(db, invitation)).toThrow(InvalidSignature);
  });

  test("is not valid if expired", () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() - 1);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    expect(() => verifyInvite(db, invitation)).toThrow(InviteExpired);
  });

  test("is not valid if not signed by an admin", () => {
    const keyPair = nacl.sign.keyPair();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(keyPair.secretKey, USER_ROLE.MEMBER, expiry);
    expect(() => verifyInvite(db, invitation)).toThrow(InvalidInviteSignature);
  });
});
