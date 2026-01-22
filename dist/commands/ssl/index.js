"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoCommands = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prettyHelp_1 = require("../../help/prettyHelp");
const ssl_1 = require("../ssl/ssl");
const helpPath = path_1.default.resolve(__dirname, "../../docs/ssl-help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch {
    helpText = "";
}
exports.cryptoCommands = new commander_1.Command("ssl")
    .description("SSL certificate utilities")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .action(function () {
    this.outputHelp();
})
    .addCommand(ssl_1.sslCommands);
