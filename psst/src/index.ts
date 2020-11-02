import { Command } from "commander";
import { getContext } from "./context";

import { listen } from "./server";

const program = new Command();

program.name("psst");
program.version("0.0.1");

program
  .command("daemon", { isDefault: true })
  .description("run the psst daemon")
  .action(() => {
    const context = getContext();
    listen(context);
  });

program.parse(process.argv);
