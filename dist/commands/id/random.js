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
const prompt_user_1 = require("../../prompts/prompt-user");
const chalk_1 = __importDefault(require("chalk"));
exports.randomCommand = new commander_1.Command("random")
    .description("Generate cryptographically secure random tokens")
    .option("-l, --length <number>", "Byte length (hex output is length × 2 characters)", "16")
    .option("-c, --count <number>", "How many tokens to generate", "1")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function ({ length, count, out, yes }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    const byteLength = Number(length);
    const tokenCount = Number(count);
    if (!Number.isInteger(byteLength) || byteLength <= 0) {
        console.error(chalk_1.default.red("✗ --length must be a positive integer"));
        process.exit(1);
    }
    if (!Number.isInteger(tokenCount) || tokenCount <= 0) {
        console.error(chalk_1.default.red("✗ --count must be a positive integer"));
        process.exit(1);
    }
    const tokens = Array.from({ length: tokenCount }, () => crypto_1.default.randomBytes(byteLength).toString("hex"));
    let output;
    switch (format) {
        case "json":
            output = JSON.stringify({
                tokens,
                count: tokenCount,
                length: byteLength,
                encoding: "hex",
            }, null, 2);
            break;
        case "text":
        default:
            output = tokens.join("\n");
            break;
    }
    // Determine output method
    let outputPath;
    if (out) {
        // User provided -o flag, use it directly
        outputPath = out;
    }
    else if (yes) {
        // User used -y flag, output to stdout
        outputPath = null;
    }
    else {
        // Ask user
        const defaultFilename = format === "json" ? "tokens.json" : "tokens.txt";
        outputPath = await (0, prompt_user_1.getSaveLocation)(defaultFilename);
    }
    if (outputPath) {
        // Save to file
        const filePath = path_1.default.resolve(outputPath);
        const dir = path_1.default.dirname(filePath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
        console.log(chalk_1.default.green("\n✓") + " Random tokens saved to file");
        console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        console.log(chalk_1.default.gray("  Count:") + ` ${tokenCount}`);
        console.log(chalk_1.default.gray("  Byte length:") + ` ${byteLength}`);
        console.log(chalk_1.default.gray("  Hex length:") + ` ${byteLength * 2} characters`);
    }
    else {
        // Output to stdout
        console.log(output);
    }
});
