import { Database } from "better-sqlite3";
import nacl from "tweetnacl";
import { addGenesisAdmin, invite, join, USER_ROLE } from "./auth";
import { init } from "./db";
import { Unauthorized } from "./errors";
import { getSecrets, setSecret } from "./secrets";

describe("Shared secrets", () => {
  const adminKeyPair = nacl.sign.keyPair();
  let db: Database;

  beforeEach(() => {
    db = init();
    addGenesisAdmin(db, adminKeyPair.publicKey);
  });

  test("can be set by admins", () => {
    setSecret(db, adminKeyPair.publicKey, "testKey", "testValue");
    setSecret(db, adminKeyPair.publicKey, "testKey2", "testValue2");
    expect(getSecrets(db, adminKeyPair.publicKey)).toEqual({
      testKey: "testValue",
      testKey2: "testValue2",
    });
  });

  test("can be updated by admins", () => {
    setSecret(db, adminKeyPair.publicKey, "testKey", "testValue");
    setSecret(db, adminKeyPair.publicKey, "testKey2", "testValue2");
    expect(getSecrets(db, adminKeyPair.publicKey)).toEqual({
      testKey: "testValue",
      testKey2: "testValue2",
    });
    setSecret(db, adminKeyPair.publicKey, "testKey", "antani");
    setSecret(db, adminKeyPair.publicKey, "testKey3", "testValue3");
    expect(getSecrets(db, adminKeyPair.publicKey)).toEqual({
      testKey: "antani",
      testKey2: "testValue2",
      testKey3: "testValue3",
    });
  });

  test("are visible to member", () => {
    setSecret(db, adminKeyPair.publicKey, "testKey", "testValue");
    setSecret(db, adminKeyPair.publicKey, "testKey2", "testValue2");

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite(adminKeyPair.secretKey, USER_ROLE.ADMIN, expiry);
    const userKeyPair = nacl.sign.keyPair();
    join(db, userKeyPair.publicKey, invitation);

    expect(getSecrets(db, userKeyPair.publicKey)).toEqual({
      testKey: "testValue",
      testKey2: "testValue2",
    });
  });

  test("are not visible to non registered users", () => {
    setSecret(db, adminKeyPair.publicKey, "testKey", "testValue");
    setSecret(db, adminKeyPair.publicKey, "testKey2", "testValue2");

    const userKeyPair = nacl.sign.keyPair();

    expect(() => getSecrets(db, userKeyPair.publicKey)).toThrow(Unauthorized);
  });
});
