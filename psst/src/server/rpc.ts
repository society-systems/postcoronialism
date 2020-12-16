import { IContext } from "../context";
import { PsstError } from "../errors";
import { hexStringToUint8Array, uint8ArrayToHexString } from "../f";
import { getSecret, setSecret } from "../secrets";
import { createSpace, hasSpace, join, verifyInvite } from "../spaces";
import { getSpaceByUser, getInviteDetails } from "../users";
import { IRPCContext } from "./jsonrpc";

function callbackify(f: any) {
  return (args: any, context: IRPCContext, callback: any) => {
    try {
      const r = f(context.user, ...args);
      callback(null, r);
    } catch (error) {
      if (error instanceof PsstError) {
        callback({
          code: error.code,
          message: error.toString(),
        });
      } else {
        throw error;
      }
    }
  };
}

export default function rpc(context: IContext) {
  const { db } = context;

  function rpcJoinSpace(user: string, name: string, invite: string) {
    return join(
      db,
      hexStringToUint8Array(user),
      name,
      hexStringToUint8Array(invite)
    );
  }

  function rpcVerifyInvite(_: string, invite: string) {
    verifyInvite(db, hexStringToUint8Array(invite));
    return true;
  }

  function rpcGetSpace(user: string) {
    return getSpaceByUser(db, hexStringToUint8Array(user));
  }

  function rpcGetInviteDetails(_: string, user: string) {
    return getInviteDetails(db, hexStringToUint8Array(user));
  }

  function rpcHasSpace(_: string, spaceName: string) {
    return hasSpace(db, spaceName);
  }

  function rpcCreateSpace(user: string, spaceName: string, userName: string) {
    return createSpace(db, hexStringToUint8Array(user), spaceName, userName);
  }

  function rpcGetSecret(user: string) {
    const record = getSecret(db, hexStringToUint8Array(user));
    // FIXME: I think this should be moved to the getSecret func
    if (record) {
      return {
        value: uint8ArrayToHexString(record.value),
        nonce: uint8ArrayToHexString(record.nonce),
      };
    }
    return null;
  }

  function rpcSetSecret(user: string, value: string, nonce: string) {
    return setSecret(
      db,
      hexStringToUint8Array(user),
      hexStringToUint8Array(value),
      hexStringToUint8Array(nonce)
    );
  }

  return {
    joinSpace: callbackify(rpcJoinSpace),
    getSpace: callbackify(rpcGetSpace),
    verifyInvite: callbackify(rpcVerifyInvite),
    getInviteDetails: callbackify(rpcGetInviteDetails),
    hasSpace: callbackify(rpcHasSpace),
    createSpace: callbackify(rpcCreateSpace),
    getSecret: callbackify(rpcGetSecret),
    setSecret: callbackify(rpcSetSecret),
  };
}
