"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataCommands = void 0;
const commander_1 = require("commander");
const json_1 = require("./json");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prettyHelp_1 = require("../../help/prettyHelp");
const helpPath = path_1.default.resolve(__dirname, "help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch {
    helpText = "";
}
exports.dataCommands = new commander_1.Command("data")
    .description("Data utilities")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .addCommand(json_1.jsonCommand);
