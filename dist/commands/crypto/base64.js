"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Command = void 0;
const commander_1 = require("commander");
const stdin_1 = require("../../utils/stdin");
const prompt_user_1 = require("../../prompts/prompt-user");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
exports.base64Command = new commander_1.Command("base64")
    .description("Base64 encode or decode data")
    .argument("[input]", "Input string (reads from stdin if omitted)")
    .option("-d, --decode", "Decode base64 input", false)
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function (input, { decode, out, yes }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    // Get input data
    const data = input ?? (await (0, stdin_1.readStdin)());
    if (!data) {
        console.error(chalk_1.default.red("✗ No input provided"));
        console.log(chalk_1.default.gray("  Provide input as argument or via stdin"));
        process.exit(1);
    }
    // Encode or decode
    let result;
    let operation;
    try {
        if (decode) {
            result = Buffer.from(data.trim(), "base64").toString("utf8");
            operation = "decode";
        }
        else {
            result = Buffer.from(data, "utf8").toString("base64");
            operation = "encode";
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Invalid base64 input"));
        console.log(chalk_1.default.gray("  Ensure the input is valid base64 when decoding"));
        process.exit(1);
    }
    // Format output
    let output;
    switch (format) {
        case "json":
            output = JSON.stringify({
                operation,
                input: data,
                output: result,
                inputLength: data.length,
                outputLength: result.length,
            }, null, 2);
            break;
        case "text":
        default:
            output = result;
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
        const defaultFilename = format === "json" ? "base64.json" : "base64.txt";
        outputPath = await (0, prompt_user_1.getSaveLocation)(defaultFilename);
    }
    if (outputPath) {
        // Save to file
        const filePath = path_1.default.resolve(outputPath);
        const dir = path_1.default.dirname(filePath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
        console.log(chalk_1.default.green("\n✓") + ` Base64 ${operation} saved to file`);
        console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        console.log(chalk_1.default.gray("  Operation:") + ` ${operation}`);
        console.log(chalk_1.default.gray("  Input length:") + ` ${data.length} chars`);
        console.log(chalk_1.default.gray("  Output length:") + ` ${result.length} chars`);
    }
    else {
        // Output to stdout
        console.log(output);
    }
});
