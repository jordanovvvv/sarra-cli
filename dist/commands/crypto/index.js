"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoCommands = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const hash_1 = require("./hash");
const base64_1 = require("./base64");
const prettyHelp_1 = require("../../help/prettyHelp");
const helpPath = path_1.default.resolve(__dirname, "help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch {
    helpText = "";
}
exports.cryptoCommands = new commander_1.Command("crypto")
    .description("Cryptographic utilities")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .action(function () {
    this.outputHelp();
})
    .addCommand(hash_1.hashCommand)
    .addCommand(base64_1.base64Command);
