import { Database } from "better-sqlite3";
import nacl from "tweetnacl";
import { db } from "./db";
import { Unauthorized } from "./errors";
import { sha256, uint8ArrayToHexString } from "./f";
import { getUser } from "./users";

const SQL_CREATE_TABLE_POSTS = `
CREATE TABLE IF NOT EXISTS posts (
    id STRING PRIMARY KEY,
    publicKey STRING NOT NULL,
    replyTo STRING,
    spaceName STRING NOT NULL,
    title STRING,
    body STRING NOT NULL,
    ts DATETIME DEFAULT (strftime('%s','now')),

    FOREIGN KEY (publicKey) REFERENCES users (publicKey) ON DELETE CASCADE,
    FOREIGN KEY (spaceName) REFERENCES spaces (name) ON DELETE CASCADE
)
`;

const SQL_CREATE_TABLE_SEEN = `
CREATE TABLE IF NOT EXISTS seen (
    publicKey STRING NOT NULL,
    postId STRING NOT NULL,
    ts DATETIME DEFAULT (strftime('%s','now')),

    UNIQUE (publicKey, postId),
    FOREIGN KEY (publicKey) REFERENCES users (publicKey) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
)
`;

const SQL_SEEN_INSERT = `
INSERT INTO seen (publicKey, postId)
VALUES ($publicKey, $postId)
`;

const SQL_SEEN_DELETE = `
DELETE FROM seen
WHERE postId = $postId AND publicKey = $publicKey
`;

const SQL_POSTS_INSERT = `
INSERT INTO posts (id, publicKey, replyTo, spaceName, title, body)
VALUES ($id, $publicKey, $replyTo, $spaceName, $title, $body)
`;

const SQL_POSTS_UPDATE = `
UPDATE
    posts

SET
    title = $title,
    body = $body

WHERE
    publicKey = $publicKey
    AND id = $id
`;

const SQL_POSTS_DELETE = `
DELETE FROM posts
WHERE id = $id AND publicKey = $publicKey
`;

const SQL_POSTS_GET = `
SELECT
    posts.id,
    posts.replyTo,
    posts.title,
    posts.body,
    posts.ts,
    users.name,
    users.publicKey,
    seen.ts AS seenTs

FROM
    posts
    INNER JOIN users
        ON posts.spaceName = users.spaceName
            AND posts.publicKey = users.publicKey
    LEFT OUTER JOIN seen
        ON posts.id = seen.postId
            AND seen.publicKey = $publicKey

WHERE
    posts.id = $id
`;

const SQL_POSTS_SELECT = `
SELECT
    posts.id,
    posts.replyTo,
    posts.title,
    posts.body,
    posts.ts,
    users.name,
    users.publicKey,
    seen.ts AS seenTs,
    MAX(posts.ts, IFNULL(replies.ts, 0)) AS lastTs,
    seen.ts >= MAX(replies.ts) AS seen

FROM
    posts
    INNER JOIN users
        ON posts.spaceName = users.spaceName
            AND posts.publicKey = users.publicKey
    LEFT OUTER JOIN posts AS replies
        on posts.id = replies.replyTo
    LEFT OUTER JOIN seen
        ON posts.id = seen.postId
            AND seen.publicKey = $publicKey

WHERE
    posts.spaceName = $spaceName
    AND posts.replyTo IS NULL

GROUP BY
    posts.id

ORDER BY
    lastTs DESC

LIMIT
    $limit

OFFSET
    $offset
`;

const SQL_POSTS_SELECT_REPLY = `
SELECT
    posts.id,
    posts.replyTo,
    posts.title,
    posts.body,
    posts.ts,
    users.name,
    users.publicKey,
    seen.ts AS seenTs,
    seen.ts >= posts.ts AS seen

FROM
    posts
    INNER JOIN users
        ON posts.spaceName = users.spaceName
            AND posts.publicKey = users.publicKey
    LEFT OUTER JOIN seen
        ON posts.id = seen.postId
            AND seen.publicKey = $publicKey

WHERE
    posts.spaceName = $spaceName
    AND replyTo = $replyTo

ORDER BY
    posts.ts ASC

LIMIT
    $limit

OFFSET
    $offset
`;

export function sqlCreateTablePosts(db: Database) {
  db.prepare(SQL_CREATE_TABLE_POSTS).run();
  db.prepare(SQL_CREATE_TABLE_SEEN).run();
}

export function sqlCreatePost(
  db: Database,
  id: string,
  publicKey: Uint8Array,
  spaceName: string,
  replyTo: string | null,
  title: string,
  body: string
) {
  const result = db.prepare(SQL_POSTS_INSERT).run({
    id,
    publicKey: uint8ArrayToHexString(publicKey),
    replyTo,
    spaceName,
    title,
    body,
  });
  return id;
}

export function sqlUpdatePost(
  db: Database,
  id: string,
  publicKey: Uint8Array,
  title: string,
  body: string
) {
  const result = db.prepare(SQL_POSTS_UPDATE).run({
    id,
    publicKey: uint8ArrayToHexString(publicKey),
    title,
    body,
  });
  return result;
}

export function sqlDeletePost(db: Database, user: Uint8Array, id: string) {
  return db.prepare(SQL_POSTS_DELETE).run({
    id,
    publicKey: uint8ArrayToHexString(user),
  });
}

export function sqlGetPost(db: Database, publicKey: Uint8Array, id: string) {
  return db.prepare(SQL_POSTS_GET).get({
    publicKey: uint8ArrayToHexString(publicKey),
    id,
  });
}

export function sqlGetPosts(
  db: Database,
  publicKey: Uint8Array,
  spaceName: string,
  replyTo: string | null,
  limit: number,
  offset: number
) {
  const query = replyTo === null ? SQL_POSTS_SELECT : SQL_POSTS_SELECT_REPLY;
  return db.prepare(query).all({
    publicKey: uint8ArrayToHexString(publicKey),
    spaceName,
    replyTo,
    limit,
    offset,
  });
}

export function sqlSeenInsert(
  db: Database,
  publicKey: Uint8Array,
  postId: string
) {
  try {
    return db.prepare(SQL_SEEN_INSERT).run({
      publicKey: uint8ArrayToHexString(publicKey),
      postId,
    });
  } catch (e) {
    if (e.toString() === "SqliteError: FOREIGN KEY constraint failed") {
      throw new Unauthorized();
    }
  }
}

export function sqlSeenDelete(
  db: Database,
  publicKey: Uint8Array,
  postId: string
) {
  return db.prepare(SQL_SEEN_DELETE).run({
    publicKey: uint8ArrayToHexString(publicKey),
    postId,
  });
}

export function addPost(
  db: Database,
  user: Uint8Array,
  replyTo: string | null,
  title: string,
  body: string
) {
  const id = sha256(nacl.randomBytes(32));
  const userData = getUser(db, user);
  if (!userData) {
    throw new Unauthorized();
  }
  sqlCreatePost(db, id, user, userData.spaceName, replyTo, title, body);
  return id;
}

export function editPost(
  db: Database,
  user: Uint8Array,
  id: string,
  title: string,
  body: string
) {
  const result = sqlUpdatePost(db, id, user, title, body);
  if (result.changes === 0) {
    throw new Unauthorized();
  }
  return getPost(db, user, id);
}
export function deletePost(db: Database, user: Uint8Array, id: string) {
  const result = sqlDeletePost(db, user, id);
  if (result.changes === 0) {
    throw new Unauthorized();
  }
}

export function getPost(db: Database, user: Uint8Array, id: string) {
  const userData = getUser(db, user);
  if (!userData) {
    throw new Unauthorized();
  }
  return sqlGetPost(db, user, id);
}

export function markPostAsSeen(db: Database, user: Uint8Array, id: string) {
  // Check if the user can read the post, raises `Unauthorized` otherwise.
  getPost(db, user, id);
  sqlSeenInsert(db, user, id);
}

export function markPostAsUnseen(db: Database, user: Uint8Array, id: string) {
  const result = sqlSeenDelete(db, user, id);
  if (result.changes === 0) {
    throw new Unauthorized();
  }
}

export function getPosts(
  db: Database,
  user: Uint8Array,
  replyTo: string | null,
  limit: number,
  offset: number
) {
  const userData = getUser(db, user);
  if (!userData) {
    throw new Unauthorized();
  }
  return sqlGetPosts(db, user, userData.spaceName, replyTo, limit, offset);
}
