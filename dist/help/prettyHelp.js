"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyHelp = prettyHelp;
const chalk_1 = __importDefault(require("chalk"));
function prettyHelp(text) {
    return (text
        // Section headers
        .replace(/^Global Options:/gm, chalk_1.default.bold.cyan("\nGLOBAL OPTIONS"))
        .replace(/^Examples:/gm, chalk_1.default.bold.cyan("\nEXAMPLES"))
        .replace(/^Notes:/gm, chalk_1.default.bold.cyan("\nNOTES"))
        // Comments
        .replace(/^# (.*)$/gm, (_, m) => chalk_1.default.gray(`# ${m}`))
        // Commands
        .replace(/^sarra .*/gm, (m) => chalk_1.default.green(m))
        // Flags
        .replace(/(--[a-z-]+)/g, chalk_1.default.yellow("$1"))
        // Bullets
        .replace(/^• (.*)$/gm, (_, m) => chalk_1.default.dim(`• ${m}`)));
}
