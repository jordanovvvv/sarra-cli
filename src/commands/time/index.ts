import { Command } from "commander";
import { nowCommand } from "./now";
import fs from "fs";
import path from "path";
import { prettyHelp } from "../../help/prettyHelp";

const helpPath = path.resolve(__dirname, "help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {
  helpText = "";
}

export const timeCommands = new Command("time")
  .description("Time utilities")
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .addCommand(nowCommand);
