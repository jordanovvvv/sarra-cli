"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidCommand = void 0;
const commander_1 = require("commander");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateUUID_1 = require("./versions/uuidv7/generateUUID");
const chalk_1 = __importDefault(require("chalk"));
const prompt_user_1 = require("../../prompts/prompt-user");
exports.uuidCommand = new commander_1.Command("uuid")
    .description("Generate UUIDs (v4 by default, v7 supported)")
    .option("--uuid-version <version>", "UUID version to generate (v4 | v7)", "v4")
    .option("-c, --count <number>", "How many UUIDs", "1")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function ({ uuidVersion, count, out, yes }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    const uuids = [];
    for (let i = 0; i < Number(count); i++) {
        if (uuidVersion === "v7") {
            uuids.push((0, generateUUID_1.uuidV7)());
        }
        else if (uuidVersion === "v4") {
            uuids.push(crypto_1.default.randomUUID());
        }
        else {
            console.error(chalk_1.default.red(`✗ Unsupported UUID version: ${uuidVersion}`));
            console.info(chalk_1.default.yellow("  Generating UUID v4 (random) instead."));
            uuids.push(crypto_1.default.randomUUID());
        }
    }
    let output;
    switch (format) {
        case "json":
            output = JSON.stringify({ version: uuidVersion, uuids }, null, 2);
            break;
        case "text":
        default:
            output = uuids.join("\n");
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
        const defaultFilename = format === "json" ? "uuids.json" : "uuids.txt";
        outputPath = await (0, prompt_user_1.getSaveLocation)(defaultFilename);
    }
    if (outputPath) {
        // Save to file
        const filePath = path_1.default.resolve(outputPath);
        const dir = path_1.default.dirname(filePath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
        console.log(chalk_1.default.green("\n✓") + " UUIDs saved to file");
        console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        console.log(chalk_1.default.gray("  Count:") + ` ${count}`);
        console.log(chalk_1.default.gray("  Version:") + ` ${uuidVersion}`);
    }
    else {
        // Output to stdout
        console.log(output);
    }
});
