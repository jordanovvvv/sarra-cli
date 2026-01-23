"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoCommands = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prettyHelp_1 = require("../../help/prettyHelp");
const my_ip_1 = require("./my-ip");
const ip_lookup_1 = require("./ip-lookup");
const ip_validate_1 = require("./ip-validate");
const local_1 = require("./local");
const helpPath = path_1.default.resolve(__dirname, "../../../docs/geo-help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch {
    helpText = "";
}
exports.geoCommands = new commander_1.Command("geo")
    .description("Geographical and IP utilities")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .addCommand(my_ip_1.myIpCommand) // Get current public IP
    .addCommand(ip_lookup_1.ipLookupCommand) // Lookup IP geolocation
    .addCommand(ip_validate_1.ipValidateCommand) // Validate IP address
    .addCommand(local_1.localCommand); // Get local network information
