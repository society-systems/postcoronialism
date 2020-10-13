import { db } from "./db";
import { create as authCreate } from "./auth";

export function init(location?: string) {
  const database = db(location);
  authCreate(database);
  return {
    db: database,
  };
}
