import { Command } from "commander";
import fs from "fs";
import path from "path";
import { hashCommand } from "./hash";
import { base64Command } from "./base64";
import { prettyHelp } from "../../help/prettyHelp";

const helpPath = path.resolve(__dirname, "../../docs/crypto-help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {
  helpText = "";
}

export const cryptoCommands = new Command("crypto")
  .description("Cryptographic utilities")
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .action(function () {
    this.outputHelp();
  })
  .addCommand(hashCommand)
  .addCommand(base64Command);
