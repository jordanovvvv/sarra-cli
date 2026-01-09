"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCommand = void 0;
const commander_1 = require("commander");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.randomCommand = new commander_1.Command("random")
    .description("Generate cryptographically secure random tokens")
    .option("-l, --length <number>", "Byte length (hex output is length × 2 characters)", "16")
    .option("-c, --count <number>", "How many tokens to generate", "1")
    .option("-o, --out <file>", "Write output to a file instead of stdout")
    .action(function ({ length, count, out }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    const byteLength = Number(length);
    const tokenCount = Number(count);
    if (!Number.isInteger(byteLength) || byteLength <= 0) {
        console.error("❌ --length must be a positive integer");
        process.exit(1);
    }
    if (!Number.isInteger(tokenCount) || tokenCount <= 0) {
        console.error("❌ --count must be a positive integer");
        process.exit(1);
    }
    const tokens = Array.from({ length: tokenCount }, () => crypto_1.default.randomBytes(byteLength).toString("hex"));
    let output;
    // Output formatting
    if (format === "json") {
        output = JSON.stringify({
            tokens,
            count: tokenCount,
            length: byteLength,
            encoding: "hex",
        }, null, 2);
    }
    else {
        output = tokens.join("\n");
    }
    // File or stdout
    if (out) {
        const filePath = path_1.default.resolve(out);
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
        fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
    }
    else {
        console.log(output);
    }
});
