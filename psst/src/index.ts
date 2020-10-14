import { Command } from "commander";
import { addGenesisAdmin } from "./auth";
import { getContext } from "./context";
import { hexStringToUint8Array } from "./f";

import { listen } from "./server";

const program = new Command();

program.name("psst");
program.version("0.0.1");

program
  .command("daemon")
  .description("run the psst daemon")
  .action(() => {
    const context = getContext();
    listen(context);
  });

program
  .command("addAdmin <publicKey>")
  .description("Add an admin")
  .action((publicKey: string) => {
    const context = getContext();
    addGenesisAdmin(context.db, hexStringToUint8Array(publicKey));
    console.log(`Added ${publicKey} to the admin list`);
  });

program.parse(process.argv);
