import { Command } from "commander";
import fs from "fs";
import path from "path";
import { prettyHelp } from "../../help/prettyHelp";
import { myIpCommand } from "./my-ip";
import { ipLookupCommand } from "./ip-lookup";
import { ipValidateCommand } from "./ip-validate";
import { localCommand } from "./local";

const helpPath = path.resolve(__dirname, "../../../docs/geo-help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {
  helpText = "";
}

export const geoCommands = new Command("geo")
  .description("Geographical and IP utilities")
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .addCommand(myIpCommand) // Get current public IP
  .addCommand(ipLookupCommand) // Lookup IP geolocation
  .addCommand(ipValidateCommand) // Validate IP address
  .addCommand(localCommand); // Get local network information
