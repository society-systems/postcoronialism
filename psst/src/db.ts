import BetterSqlite3 from "better-sqlite3";

export function db(location: string = ":memory:") {
  return new BetterSqlite3(location);
}
