import jayson from "jayson";
import cors from "cors";
import express from "express";
import { json as jsonParser } from "body-parser";
import banner from "./banner";

import { IContext } from "./context";
import rpc from "./rpc";

export function listen(context: IContext) {
  const app = express();
  const server = new jayson.Server(rpc(context));
  app.use(cors({ methods: ["POST"] }));
  app.use(jsonParser());
  app.use(server.middleware());
  console.log(banner);
  console.log("Sqlite database path:", context.location);
  console.log("JSONRPC server listening at port:", context.port);
  app.listen(context.port);
}
