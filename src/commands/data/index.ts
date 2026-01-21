import { Command } from "commander";
import { jsonCommand } from "./json";
import fs from "fs";
import path from "path";
import { prettyHelp } from "../../help/prettyHelp";

const helpPath = path.resolve(__dirname, "../../docs/data-help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {
  helpText = "";
}

export const dataCommands = new Command("data")
  .description("Data utilities")
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .addCommand(jsonCommand);
