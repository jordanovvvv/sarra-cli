"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonCommand = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const stdin_1 = require("../../utils/stdin");
exports.jsonCommand = new commander_1.Command("json").description("JSON utilities");
exports.jsonCommand
    .command("format")
    .description("Pretty-print JSON")
    .argument("[file]", "JSON file (reads from stdin if omitted)")
    .action(async (file) => {
    const input = file ? fs_1.default.readFileSync(file, "utf8") : await (0, stdin_1.readStdin)();
    try {
        const parsed = JSON.parse(input);
        console.log(JSON.stringify(parsed, null, 2));
    }
    catch {
        console.error("Invalid JSON input");
        process.exit(1);
    }
    // TODO: Add output for text, json and other formats
});
