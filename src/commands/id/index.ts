import { Command } from "commander";
import { uuidCommand } from "./uuid";
import { randomCommand } from "./random";
import fs from "fs";
import path from "path";
import { prettyHelp } from "../../help/prettyHelp";

const helpPath = path.resolve(__dirname, "help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {}

export const idCommands = new Command("id")
  .description(
    "Generate and manage identifiers, tokens, and unique values commonly used " +
      "in databases, APIs, authentication, and distributed systems."
  )
  .option(
    "--format <format>",
    "Output format: text or json (applies to all id subcommands)",
    "text"
  )
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .action(function () {
    this.outputHelp();
  })
  .addCommand(uuidCommand)
  .addCommand(randomCommand);
