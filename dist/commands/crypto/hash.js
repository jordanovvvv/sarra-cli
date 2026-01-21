"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCommand = void 0;
const commander_1 = require("commander");
const crypto_1 = __importDefault(require("crypto"));
const stdin_1 = require("../../utils/stdin");
const prompt_user_1 = require("../../prompts/prompt-user");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
exports.hashCommand = new commander_1.Command("hash")
    .description("Generate cryptographic hash from input")
    .argument("<algorithm>", "Hash algorithm (md5 | sha1 | sha256 | sha512)")
    .argument("[input]", "Input string to hash (reads from stdin if omitted)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function (algorithm, input, { out, yes }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    // Validate algorithm
    const supportedAlgorithms = ["md5", "sha1", "sha256", "sha512"];
    if (!supportedAlgorithms.includes(algorithm.toLowerCase())) {
        console.error(chalk_1.default.red("✗ Unsupported hash algorithm"));
        console.log(chalk_1.default.gray("  Supported: md5, sha1, sha256, sha512"));
        process.exit(1);
    }
    // Get input data
    const data = input ?? (await (0, stdin_1.readStdin)());
    if (!data) {
        console.error(chalk_1.default.red("✗ No input provided"));
        console.log(chalk_1.default.gray("  Provide input as argument or via stdin"));
        process.exit(1);
    }
    // Generate hash
    const hash = crypto_1.default
        .createHash(algorithm.toLowerCase())
        .update(data)
        .digest("hex");
    // Format output
    let output;
    switch (format) {
        case "json":
            output = JSON.stringify({
                algorithm: algorithm.toLowerCase(),
                hash,
                input: data,
                inputLength: data.length,
            }, null, 2);
            break;
        case "text":
        default:
            output = hash;
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
        const defaultFilename = format === "json" ? "hash.json" : "hash.txt";
        outputPath = await (0, prompt_user_1.getSaveLocation)(defaultFilename);
    }
    if (outputPath) {
        // Save to file
        const filePath = path_1.default.resolve(outputPath);
        const dir = path_1.default.dirname(filePath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
        console.log(chalk_1.default.green("\n✓") + " Hash saved to file");
        console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        console.log(chalk_1.default.gray("  Algorithm:") + ` ${algorithm.toLowerCase()}`);
        console.log(chalk_1.default.gray("  Hash:") + ` ${hash}`);
    }
    else {
        // Output to stdout
        console.log(output);
    }
});
