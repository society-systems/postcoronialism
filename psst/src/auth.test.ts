import { Database } from "better-sqlite3";
import nacl from "tweetnacl";
import {
  verify,
  join,
  USER_ROLE,
  hasRole,
  addGenesisAdmin,
  invite,
  verifyInvite,
  getUser,
} from "./auth";
import { init } from "./db";
import {
  InvalidInviteSignature,
  InvalidSignature,
  InviteExpired,
} from "./errors";
import { uint8ArrayToHexString } from "./f";

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

  test("adds a user with a specific role", () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    const userKeyPair = nacl.sign.keyPair();
    join(db, userKeyPair.publicKey, invitation);
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.MEMBER)).toBeTruthy();
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.ADMIN)).toBeFalsy();
  });

  test("doesn't allow to replay an invite", () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    const userKeyPair = nacl.sign.keyPair();
    join(db, userKeyPair.publicKey, invitation);
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.MEMBER)).toBeTruthy();

    const user2KeyPair = nacl.sign.keyPair();
    expect(() => join(db, user2KeyPair.publicKey, invitation)).toThrow(
      "UNIQUE constraint failed"
    );
  });

  test("gets a user that exists", () => {
    expect(getUser(db, adminKeyPair.publicKey)).toEqual({
      invite: "genesis",
      publicKey: uint8ArrayToHexString(adminKeyPair.publicKey),
      role: USER_ROLE.ADMIN,
    });
  });

  test("gets a user that doesn't exists", () => {
    const keyPair = nacl.sign.keyPair();
    expect(getUser(db, keyPair.publicKey)).toBeUndefined();
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
    expiry.setMilliseconds(0);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER, expiry);
    const verifiedInvitation = verifyInvite(db, invitation);
    expect(verifiedInvitation.signer).toEqual(adminKeyPair.publicKey);
    expect(verifiedInvitation.role).toEqual(USER_ROLE.MEMBER);
    expect(verifiedInvitation.expiry).toEqual(expiry);
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
