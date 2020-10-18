import { getRole, join } from "../auth";
import { IContext } from "../context";
import { PsstError } from "../errors";
import { hexStringToUint8Array } from "../f";
import { getSecrets } from "../secrets";
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

  function rpcJoin(user: string, invite: string) {
    return join(db, hexStringToUint8Array(user), hexStringToUint8Array(invite));
  }

  function rpcGetRole(user: string) {
    return getRole(db, hexStringToUint8Array(user));
  }

  function rpcGetSecrets(user: string) {
    return getSecrets(db, hexStringToUint8Array(user));
  }

  return {
    join: callbackify(rpcJoin),
    getRole: callbackify(rpcGetRole),
    getSecrets: callbackify(rpcGetSecrets),
  };
}
