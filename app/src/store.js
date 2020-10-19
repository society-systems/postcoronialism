import { writable, derived, get } from "svelte/store";
import { generateMnemonic, validateMnemonic } from "bip39";
import nacl from "tweetnacl";
import { Buffer } from "buffer";
import { rpcGetRole, rpcGetSecrets, rpcJoin } from "./rpc";

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

export async function join(invite) {
  await rpcJoin(invite).send(get(keyPair));
  reloadUser();
}

// STORES
export const mnemonic = writable(getMnemonic());
const reload = writable();

export const keyPair = derived([mnemonic, reload], ([$mnemonic, $reload]) =>
  nacl.sign.keyPair.fromSeed(
    nacl.hash(new TextEncoder().encode($mnemonic)).slice(0, 32)
  )
);

export const publicKey = derived(keyPair, ($keyPair) =>
  Buffer.from($keyPair.publicKey).toString("hex")
);

export const role = derived(keyPair, async ($keyPair, set) => {
  const role = await rpcGetRole().send($keyPair);
  if (role === 0) {
    set("admin");
  } else if (role === 1) {
    set("member");
  } else {
    set();
  }
});

export const secrets = derived(
  [keyPair, role],
  async ([$keyPair, $role], set) => {
    if ($role) {
      set(await rpcGetSecrets().send($keyPair));
    } else {
      set();
    }
  }
);
