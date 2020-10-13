import { Database } from "better-sqlite3";
import nacl from "tweetnacl";
import {
  verify,
  addUser,
  USER_ROLE,
  getUser,
  hasRole,
  addGenesisAdmin,
  invite,
} from "./auth";
import { init } from "./init";

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
    db = init().db;
    addGenesisAdmin(db, adminKeyPair.publicKey);
  });

  //test('registers a new user', async() => {
  //  const keyPair = nacl.sign.keyPair();
  //});
  test("adds a user with a specific role", async () => {
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.MEMBER);
    const userKeyPair = nacl.sign.keyPair();
    addUser(db, userKeyPair.publicKey, USER_ROLE.MEMBER, invitation);
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.MEMBER)).toBeTruthy();
    expect(hasRole(db, userKeyPair.publicKey, USER_ROLE.ADMIN)).toBeFalsy();
  });
});
