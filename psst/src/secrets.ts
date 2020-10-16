import { Database } from "better-sqlite3";
import { getRole, hasRole, USER_ROLE } from "./auth";
import { Unauthorized } from "./errors";

const SQL_SECRETS_CREATE = `
CREATE TABLE IF NOT EXISTS secrets(
  key STRING NOT NULL,
  value STRING NOT NULL,
  UNIQUE(key)
)`;

const SQL_SECRETS_GET = `
SELECT *
FROM secrets
`;

const SQL_SECRETS_SET = `
INSERT OR REPLACE INTO secrets (key, value)
VALUES ($key, $value)
`;

export function create(db: Database) {
  db.prepare(SQL_SECRETS_CREATE).run();
}

export function getSecrets(db: Database, user: Uint8Array) {
  const role = getRole(db, user);
  if (role === USER_ROLE.ADMIN || role === USER_ROLE.MEMBER) {
    return db
      .prepare(SQL_SECRETS_GET)
      .all()
      .reduce(
        (acc: any, curr: { key: string; value: string }) =>
          (acc[curr.key] = curr.value) && acc,
        {}
      );
  } else {
    throw new Unauthorized();
  }
}

export function setSecret(
  db: Database,
  user: Uint8Array,
  key: string,
  value: string
) {
  const role = getRole(db, user);
  if (role === USER_ROLE.ADMIN) {
    return db.prepare(SQL_SECRETS_SET).run({
      key,
      value,
    });
  } else {
    throw new Unauthorized();
  }
}
