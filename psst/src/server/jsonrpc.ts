import { Request, Response } from "express";
import { Server } from "jayson";
import { verify } from "../auth";
import { hexStringToUint8Array, uint8ArrayToHexString } from "../f";
import { getSecrets } from "../secrets";

export interface IRPCContext {
  user?: Uint8Array;
}

export function jsonrpc(server: Server) {
  return (req: Request, res: Response, next: Function) => {
    let rpcContext: IRPCContext = {
      user: res.locals.user,
    };

    console.log(
      "[RPC]",
      uint8ArrayToHexString(res.locals.user) + ":",
      `${req.body.method}(${req.body.params})`
    );

    server.call(req.body, rpcContext, (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.send(err);
        //return next(err);
      }
      res.send(result || {});
    });
  };
}

export function verifySignature(req: Request, res: Response, buf: Buffer) {
  const publicKey = req.get("psst-public-key");
  const signature = req.get("psst-signature");
  if (publicKey && signature) {
    if (
      verify(
        Uint8Array.from(buf),
        hexStringToUint8Array(signature),
        hexStringToUint8Array(publicKey)
      )
    ) {
      res.locals.user = hexStringToUint8Array(publicKey);
    } else {
      throw new Error("Bad signature");
      //res.status(400).send("Bad Signature");
    }
  }
}
