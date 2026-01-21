"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonCommand = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const stdin_1 = require("../../utils/stdin");
const prompt_user_1 = require("../../prompts/prompt-user");
exports.jsonCommand = new commander_1.Command("json").description("JSON utilities");
// Format/Pretty-print JSON
exports.jsonCommand
    .command("format")
    .alias("pretty")
    .description("Pretty-print JSON with configurable indentation")
    .argument("[file]", "JSON file (reads from stdin if omitted)")
    .option("-i, --indent <spaces>", "Number of spaces for indentation", "2")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async (file, { indent, out, yes }) => {
    const input = file ? fs_1.default.readFileSync(file, "utf8") : await (0, stdin_1.readStdin)();
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, parseInt(indent));
        // Determine output method
        let outputPath;
        if (out) {
            outputPath = out;
        }
        else if (yes) {
            outputPath = null;
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("formatted.json");
        }
        if (outputPath) {
            const filePath = path_1.default.resolve(outputPath);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, formatted + "\n", "utf8");
            console.log(chalk_1.default.green("\n✓") + " JSON formatted and saved");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        }
        else {
            console.log(formatted);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Invalid JSON input"));
        process.exit(1);
    }
});
// Minify JSON
exports.jsonCommand
    .command("minify")
    .alias("min")
    .description("Minify JSON (remove whitespace)")
    .argument("[file]", "JSON file (reads from stdin if omitted)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async (file, { out, yes }) => {
    const input = file ? fs_1.default.readFileSync(file, "utf8") : await (0, stdin_1.readStdin)();
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        let outputPath;
        if (out) {
            outputPath = out;
        }
        else if (yes) {
            outputPath = null;
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("minified.json");
        }
        if (outputPath) {
            const filePath = path_1.default.resolve(outputPath);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, minified, "utf8");
            console.log(chalk_1.default.green("\n✓") + " JSON minified and saved");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
            console.log(chalk_1.default.gray("  Size reduction:") +
                ` ${input.length} → ${minified.length} bytes`);
        }
        else {
            console.log(minified);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Invalid JSON input"));
        process.exit(1);
    }
});
// Validate JSON
exports.jsonCommand
    .command("validate")
    .alias("check")
    .description("Validate JSON syntax")
    .argument("[file]", "JSON file (reads from stdin if omitted)")
    .action(async (file) => {
    const input = file ? fs_1.default.readFileSync(file, "utf8") : await (0, stdin_1.readStdin)();
    try {
        JSON.parse(input);
        console.log(chalk_1.default.green("✓ Valid JSON"));
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Invalid JSON"));
        console.log(chalk_1.default.gray("  Error:") + ` ${error.message}`);
        process.exit(1);
    }
});
// Query/Extract JSON path
exports.jsonCommand
    .command("query")
    .alias("get")
    .description("Extract value from JSON using dot notation path")
    .argument("<path>", "JSON path (e.g., 'user.name' or 'items[0].id')")
    .argument("[file]", "JSON file (reads from stdin if omitted)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async (jsonPath, file, { out, yes }) => {
    const input = file ? fs_1.default.readFileSync(file, "utf8") : await (0, stdin_1.readStdin)();
    try {
        const parsed = JSON.parse(input);
        // Simple path resolver (supports dot notation and array indices)
        const value = jsonPath
            .split(/\.|\[|\]/)
            .filter(Boolean)
            .reduce((obj, key) => {
            return obj?.[key];
        }, parsed);
        if (value === undefined) {
            console.error(chalk_1.default.red("✗ Path not found in JSON"));
            process.exit(1);
        }
        const output = typeof value === "object"
            ? JSON.stringify(value, null, 2)
            : String(value);
        let outputPath;
        if (out) {
            outputPath = out;
        }
        else if (yes) {
            outputPath = null;
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("query-result.json");
        }
        if (outputPath) {
            const filePath = path_1.default.resolve(outputPath);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
            console.log(chalk_1.default.green("\n✓") + " Query result saved");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        }
        else {
            console.log(output);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Invalid JSON input or path"));
        process.exit(1);
    }
});
// Merge JSON files
exports.jsonCommand
    .command("merge")
    .description("Merge multiple JSON objects")
    .argument("<files...>", "JSON files to merge")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async (files, { out, yes }) => {
    try {
        const objects = files.map((file) => {
            const content = fs_1.default.readFileSync(file, "utf8");
            return JSON.parse(content);
        });
        const merged = Object.assign({}, ...objects);
        const output = JSON.stringify(merged, null, 2);
        let outputPath;
        if (out) {
            outputPath = out;
        }
        else if (yes) {
            outputPath = null;
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("merged.json");
        }
        if (outputPath) {
            const filePath = path_1.default.resolve(outputPath);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
            console.log(chalk_1.default.green("\n✓") + " JSON files merged");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
            console.log(chalk_1.default.gray("  Merged:") + ` ${files.length} files`);
        }
        else {
            console.log(output);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Error merging JSON files"));
        console.error(chalk_1.default.gray("  Ensure all files contain valid JSON objects"));
        process.exit(1);
    }
});
// Convert to/from other formats
exports.jsonCommand
    .command("to-csv")
    .description("Convert JSON array to CSV")
    .argument("[file]", "JSON file with array of objects (reads from stdin if omitted)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async (file, { out, yes }) => {
    const input = file ? fs_1.default.readFileSync(file, "utf8") : await (0, stdin_1.readStdin)();
    try {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            console.error(chalk_1.default.red("✗ Input must be a non-empty JSON array"));
            process.exit(1);
        }
        // Get all unique keys from all objects
        const keys = Array.from(new Set(parsed.flatMap(Object.keys)));
        // Create CSV
        const csvRows = [
            keys.join(","),
            ...parsed.map((obj) => keys
                .map((key) => {
                const value = obj[key];
                const stringValue = value === null || value === undefined ? "" : String(value);
                // Escape quotes and wrap in quotes if contains comma or quote
                return stringValue.includes(",") || stringValue.includes('"')
                    ? `"${stringValue.replace(/"/g, '""')}"`
                    : stringValue;
            })
                .join(",")),
        ];
        const csv = csvRows.join("\n");
        let outputPath;
        if (out) {
            outputPath = out;
        }
        else if (yes) {
            outputPath = null;
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("output.csv");
        }
        if (outputPath) {
            const filePath = path_1.default.resolve(outputPath);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, csv + "\n", "utf8");
            console.log(chalk_1.default.green("\n✓") + " JSON converted to CSV");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
            console.log(chalk_1.default.gray("  Rows:") + ` ${parsed.length}`);
        }
        else {
            console.log(csv);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Error converting to CSV"));
        process.exit(1);
    }
});
