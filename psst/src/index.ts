import jayson from "jayson";
import cors from "cors";
import connect from "connect";
import { json as jsonParser } from "body-parser";
import banner from "./banner";

import { getContext } from "./context";
import rpc from "./rpc";

const context = getContext();
const app = connect();
const server = new jayson.Server(rpc(context));

// FIXME: not sure about this casting
app.use(cors({ methods: ["POST"] }) as connect.HandleFunction);
app.use(jsonParser());
app.use(server.middleware());
console.log(banner);
console.log("Sqlite database path:", context.location);
console.log("JSONRPC server listening at port:", context.port);
app.listen(context.port);
