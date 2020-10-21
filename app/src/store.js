import { writable, derived, get, readable } from "svelte/store";
import { location } from "svelte-spa-router";
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
} from "./rpc";
import {
  generateDeterministicSeed,
  uint8ArrayToHexString,
  hexStringToUint8Array,
  getSignerFromInvite,
} from "./crypto";

// ACTIONS
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

export function logout() {
  localStorage.removeItem("mnemonic");
  setMnemonic(getMnemonic());
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

window.setSecret = setSecret;
window.getSecret = getSecret;
window.updateSecret = updateSecret;

// STORES
export const mnemonic = writable(getMnemonic());
const reload = writable();

export const secret = readable({}, async (set) => set(await getSecret()));

export const spaceName = derived(location, ($location) => {
  const match = /^\/space\/([^\/]+)/.exec($location);
  if (match) {
    return decodeURIComponent(match[1]);
  } else {
    return null;
  }
});

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
        record = {
          claimed: await rpcHasSpace($spaceName).send($keyPair),
        };
      } else {
        // If the record is defined, then we are part of this space.
        // In that case we check if the space is listed in our secrets.
        const secret = await getSecret();
        if (!secret.spaces) {
          secret.spaces = {};
        }
        if (!secret.spaces[$spaceName]) {
          await updateSecret({ spaces: { [$spaceName]: 1, ...secret.spaces } });
        }
      }
      set(record);
    }
  }
);
