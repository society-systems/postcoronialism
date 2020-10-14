import BetterSqlite3 from "better-sqlite3";
import { create as authCreate } from "./auth";

export function db(location: string = ":memory:") {
  return new BetterSqlite3(location);
}

export function init(location?: string) {
  const database = db(location);
  authCreate(database);
  return database;
}
