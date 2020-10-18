import { writable, derived, get } from "svelte/store";
import { generateMnemonic } from "bip39";
import nacl from "tweetnacl";
import { Buffer } from "buffer";
import { rpcGetRole, rpcGetSecrets, rpcJoin } from "./rpc";

window.generateMnemonic = generateMnemonic;

// ACTIONS
export function getMnemonic() {
  let m = localStorage.getItem("mnemonic");
  if (!m || m.trim().length === 0) {
    m = generateMnemonic();
    localStorage.setItem("mnemonic", m);
  }
  return m;
}

export function setMnemonic(m) {
  localStorage.setItem("mnemonic", m);
  mnemonic.set(m);
}

export function reloadUser() {
  reload.set(Math.random());
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
  set(role);
});

export const secrets = derived(
  [keyPair, role],
  async ([$keyPair, $role], set) => {
    if ($role !== undefined) {
      set(await rpcGetSecrets().send($keyPair));
    }
  }
);
