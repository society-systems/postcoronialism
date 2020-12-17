import { writable, derived, get, readable } from "svelte/store";
import { generateMnemonic, validateMnemonic } from "bip39";
import nacl from "tweetnacl";
import { Buffer } from "buffer";
import {
  rpcGetSpace,
  rpcHasSpace,
  rpcJoinSpace,
  rpcCreateSpace,
  rpcGetSecret,
  rpcSetSecret,
  rpcGetInviteDetails,
  rpcVerifyInvite,
  rpcAddPost,
  rpcDeletePost,
  rpcEditPost,
  rpcGetPost,
  rpcGetPosts,
  rpcMarkPostAsSeen,
  rpcMarkPostAsUnseen,
} from "./rpc";
import {
  generateDeterministicSeed,
  uint8ArrayToHexString,
  hexStringToUint8Array,
  getSignerFromInvite,
} from "./crypto";

const SPACE_NAME = "postcoronialism";
const PATH_SPACE_NAME = "/space/" + SPACE_NAME;

// ACTIONS

export async function login(m) {
  if (!setMnemonic(m)) {
    throw new Error("Invalid mnemonic");
  }
  const spaceKeyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(m, "/space/" + SPACE_NAME)
  );
  const space = await rpcGetSpace().send(spaceKeyPair);
  if (!space) {
    throw new Error("Not authorized");
  }
}

export function logout() {
  localStorage.removeItem("mnemonic");
  setMnemonic(getMnemonic());
}

export function getMnemonic() {
  let m = localStorage.getItem("mnemonic");
  if (!validateMnemonic(m)) {
    m = generateMnemonic();
    localStorage.setItem("mnemonic", m);
  }
  return m;
}

export function setMnemonic(m) {
  m = m
    .split(" ")
    .filter((token) => token.length)
    .join(" ");
  if (validateMnemonic(m)) {
    localStorage.setItem("mnemonic", m);
    mnemonic.set(m);
    return true;
  } else {
    return false;
  }
}

export function reloadUser() {
  reload.set(Math.random());
}

export async function joinSpace(spaceName, userName, invite) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, spaceName ? "/space/" + spaceName : "")
  );
  await rpcJoinSpace(userName, invite).send(keyPair);
  reloadUser();
}

export async function createSpace(spaceName, userName) {
  await rpcCreateSpace(spaceName, userName).send(get(keyPair));
  reloadUser();
}

export async function verifyInvite(invite) {
  return await rpcVerifyInvite(invite).send(get(keyPair));
}

export async function getInviteDetails(invite) {
  const signer = getSignerFromInvite(invite);
  return await rpcGetInviteDetails(signer).send(get(keyPair));
}

export async function setSecret(json) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic)
  );
  const message = new TextEncoder().encode(JSON.stringify(json));
  const encKey = generateDeterministicSeed(mnemonic, "/secretbox");
  const nonce = nacl.randomBytes(24);
  const enc = nacl.secretbox(message, nonce, encKey);
  await rpcSetSecret(
    uint8ArrayToHexString(enc),
    uint8ArrayToHexString(nonce)
  ).send(keyPair);
}

export async function getSecret() {
  const mnemonic = getMnemonic();
  const encKey = generateDeterministicSeed(mnemonic, "/secretbox");
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic)
  );
  const res = await rpcGetSecret().send(keyPair);
  if (res) {
    const { value, nonce } = res;
    const message = nacl.secretbox.open(
      hexStringToUint8Array(value),
      hexStringToUint8Array(nonce),
      encKey
    );
    return JSON.parse(new TextDecoder().decode(message));
  } else {
    return {};
  }
}

export async function updateSecret(json) {
  const current = await getSecret();
  await setSecret({ ...current, ...json });
}

export async function addPost(parentId, title, body) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcAddPost(parentId, title, body).send(keyPair);
}

export async function editPost(id, title, body) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcEditPost(id, title, body).send(keyPair);
}

export async function deletePost(id) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcDeletePost(id).send(keyPair);
}

export async function getPost(id) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcGetPost(id).send(keyPair);
}

export async function markPostAsSeen(id) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcMarkPostAsSeen(id).send(keyPair);
}

export async function markPostAsUnseen(id) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcMarkPostAsUnseen(id).send(keyPair);
}

export async function getPosts(parentId, limit, offset) {
  const mnemonic = getMnemonic();
  const keyPair = nacl.sign.keyPair.fromSeed(
    generateDeterministicSeed(mnemonic, PATH_SPACE_NAME)
  );
  return await rpcGetPosts(parentId, limit, offset).send(keyPair);
}

// STORES
export const mnemonic = writable(getMnemonic());
const reload = writable();

export const secret = readable({}, async (set) => set(await getSecret()));

export const spaceName = readable(SPACE_NAME);

//export const spaceName = derived(location, ($location) => {
//  const match = /^\/space\/([^\/]+)/.exec($location);
//  if (match) {
//    return decodeURIComponent(match[1]);
//  } else {
//    return null;
//  }
//});

export const keyPair = derived(
  [mnemonic, spaceName, reload],
  ([$mnemonic, $spaceName, $reload]) =>
    nacl.sign.keyPair.fromSeed(
      generateDeterministicSeed(
        $mnemonic,
        $spaceName ? "/space/" + $spaceName : ""
      )
    )
);

export const publicKey = derived(keyPair, ($keyPair) =>
  Buffer.from($keyPair.publicKey).toString("hex")
);

export const space = derived(
  [keyPair, spaceName],
  async ([$keyPair, $spaceName], set) => {
    if (!$spaceName) {
      set(undefined);
    } else {
      let record = await rpcGetSpace().send($keyPair);
      if (record === undefined) {
        const hasSpace = await rpcHasSpace($spaceName).send($keyPair);
        if (!hasSpace) {
          await createSpace($spaceName, "admin");
        } else {
          set(false);
        }
      } else {
        set(record);
      }
    }
  }
);

export const inMeeting = writable(false);
