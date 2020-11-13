import BetterSqlite3 from "better-sqlite3";
import { sqlCreateTableSpaces } from "./spaces";
import { sqlCreateTableUsers } from "./users";
import { sqlCreateTableSecrets } from "./secrets";
import { sqlCreateTablePosts } from "./forum";

const SQL_PRAGMA_FOREIGN_KEYS = `PRAGMA foreign_keys = ON`;

export function db(location: string = ":memory:") {
  return new BetterSqlite3(location);
}

export function init(location?: string) {
  const database = db(location);
  database.prepare(SQL_PRAGMA_FOREIGN_KEYS).run();
  sqlCreateTableSpaces(database);
  sqlCreateTableUsers(database);
  sqlCreateTableSecrets(database);
  sqlCreateTablePosts(database);
  return database;
}
