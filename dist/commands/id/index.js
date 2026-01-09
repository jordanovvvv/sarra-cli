"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idCommands = void 0;
const commander_1 = require("commander");
const uuid_1 = require("./uuid");
const random_1 = require("./random");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prettyHelp_1 = require("../../help/prettyHelp");
const helpPath = path_1.default.resolve(__dirname, "help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch { }
exports.idCommands = new commander_1.Command("id")
    .description("Generate and manage identifiers, tokens, and unique values commonly used " +
    "in databases, APIs, authentication, and distributed systems.")
    .option("--format <format>", "Output format: text or json (applies to all id subcommands)", "text")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .action(function () {
    this.outputHelp();
})
    .addCommand(uuid_1.uuidCommand)
    .addCommand(random_1.randomCommand);
