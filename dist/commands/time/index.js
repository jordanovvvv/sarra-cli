"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeCommands = void 0;
const commander_1 = require("commander");
const now_1 = require("./now");
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
exports.timeCommands = new commander_1.Command("time")
    .description("Time utilities")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .addCommand(now_1.nowCommand);
