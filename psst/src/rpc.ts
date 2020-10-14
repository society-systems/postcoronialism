import { join } from "./auth";
import { IContext } from "./context";
import { PsstError } from "./errors";

function callbackify(f: any) {
  return (args: any, callback: any) => {
    try {
      callback(null, f(...args));
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
  return {
    join: callbackify(join.bind(null, context.db)),
  };
}
