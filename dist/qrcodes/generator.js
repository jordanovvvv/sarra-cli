"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrCommands = void 0;
// src/commands/qr.ts
const commander_1 = require("commander");
const qrcode_1 = __importDefault(require("qrcode"));
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const qr_help_1 = require("./qr-help");
const prompt_user_1 = require("./prompt-user");
exports.qrCommands = new commander_1.Command("qr").description("QR code generation and utilities");
// Helper function to display ASCII QR code
async function displayAscii(text, small = true) {
    const ascii = await qrcode_1.default.toString(text, {
        type: "terminal",
        small: small,
    });
    console.log("\n" + chalk_1.default.bold("Terminal Preview:"));
    console.log(ascii);
}
// Generate QR code from text
exports.qrCommands
    .command("generate")
    .alias("gen")
    .description("Generate a QR code from text")
    .argument("<text>", "Text to encode in the QR code")
    .option("-o, --output <file>", "Output file path (skips prompt)")
    .option("-y, --yes", "Skip prompt and use default location", false)
    .option("-s, --size <pixels>", "Image width in pixels", "300")
    .option("-e, --error-correction <level>", "Error correction level (L, M, Q, H)", "M")
    .option("-t, --terminal", "Display ASCII representation in terminal", false)
    .option("--small", "Use small ASCII characters (with -t)", true)
    .option("--dark <color>", "Dark color (hex)", "#000000")
    .option("--light <color>", "Light color (hex)", "#FFFFFF")
    .action(async (text, options) => {
    try {
        const errorLevel = options.errorCorrection.toUpperCase();
        if (!["L", "M", "Q", "H"].includes(errorLevel)) {
            console.error(chalk_1.default.red("✗ Invalid error correction level"));
            console.log("  Use: L (7%), M (15%), Q (25%), or H (30%)");
            process.exit(1);
        }
        // Determine output path
        let outputPath;
        if (options.output) {
            // User provided -o flag, use it directly
            outputPath = options.output;
        }
        else if (options.yes) {
            // User used -y flag, use default
            outputPath = "qrcode.png";
        }
        else {
            // Ask user
            outputPath = await (0, prompt_user_1.getSaveLocation)("qrcode.png");
        }
        // If user chose not to save, only show terminal
        if (!outputPath) {
            console.log(chalk_1.default.yellow("\n⊘ Skipping file save\n"));
            await displayAscii(text, options.small);
            return;
        }
        const qrOptions = {
            errorCorrectionLevel: errorLevel,
            width: parseInt(options.size, 10),
            margin: 4,
            color: {
                dark: options.dark,
                light: options.light,
            },
        };
        // Generate and save QR code
        await qrcode_1.default.toFile(outputPath, text, qrOptions);
        console.log(chalk_1.default.green("\n✓") + " QR code generated successfully");
        console.log(chalk_1.default.gray("  File:") + ` ${outputPath}`);
        console.log(chalk_1.default.gray("  Size:") + ` ${options.size}px`);
        console.log(chalk_1.default.gray("  Error correction:") + ` ${errorLevel}`);
        // Show ASCII version if requested
        if (options.terminal) {
            await displayAscii(text, options.small);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Error generating QR code:"), error);
        process.exit(1);
    }
});
// Generate QR code to terminal only (no file output)
exports.qrCommands
    .command("terminal")
    .alias("term")
    .description("Display QR code as ASCII art in terminal only (no file)")
    .argument("<text>", "Text to encode")
    .option("--small", "Use small characters", true)
    .action(async (text, options) => {
    try {
        await displayAscii(text, options.small);
        console.log(chalk_1.default.gray(`\nEncoded: "${text}"`));
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Error generating QR code:"), error);
        process.exit(1);
    }
});
// Generate QR code from URL
exports.qrCommands
    .command("url")
    .description("Generate QR code from a URL")
    .argument("<url>", "URL to encode")
    .option("-o, --output <file>", "Output file path (skips prompt)")
    .option("-y, --yes", "Skip prompt and use default location", false)
    .option("-s, --size <pixels>", "Image width in pixels", "400")
    .option("-t, --terminal", "Display ASCII representation in terminal", false)
    .option("--small", "Use small ASCII characters (with -t)", true)
    .action(async (url, options) => {
    try {
        // Basic URL validation
        try {
            new URL(url);
        }
        catch {
            console.error(chalk_1.default.red("✗ Invalid URL format"));
            process.exit(1);
        }
        // Determine output path
        let outputPath;
        if (options.output) {
            outputPath = options.output;
        }
        else if (options.yes) {
            outputPath = "url-qr.png";
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("url-qr.png");
        }
        if (!outputPath) {
            console.log(chalk_1.default.yellow("\n⊘ Skipping file save\n"));
            await displayAscii(url, options.small);
            return;
        }
        const qrOptions = {
            errorCorrectionLevel: "M",
            width: parseInt(options.size, 10),
            margin: 4,
        };
        await qrcode_1.default.toFile(outputPath, url, qrOptions);
        console.log(chalk_1.default.green("\n✓") + " URL QR code generated");
        console.log(chalk_1.default.gray("  URL:") + ` ${url}`);
        console.log(chalk_1.default.gray("  File:") + ` ${outputPath}`);
        if (options.terminal) {
            await displayAscii(url, options.small);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Error generating QR code:"), error);
        process.exit(1);
    }
});
// Generate QR code from file content
exports.qrCommands
    .command("file")
    .description("Generate QR code from file content")
    .argument("<input>", "Input file to read")
    .option("-o, --output <file>", "Output QR code file (skips prompt)")
    .option("-y, --yes", "Skip prompt and use default location", false)
    .option("-s, --size <pixels>", "Image width in pixels", "400")
    .option("-t, --terminal", "Display ASCII representation in terminal", false)
    .option("--small", "Use small ASCII characters (with -t)", true)
    .action(async (input, options) => {
    try {
        if (!fs.existsSync(input)) {
            console.error(chalk_1.default.red("✗ Input file not found:"), input);
            process.exit(1);
        }
        const content = fs.readFileSync(input, "utf-8");
        if (content.length > 2953) {
            console.warn(chalk_1.default.yellow("⚠ Warning: Content may be too large for QR code"));
            console.log(chalk_1.default.gray("  Maximum recommended: ~2953 characters"));
        }
        // Determine output path
        let outputPath;
        if (options.output) {
            outputPath = options.output;
        }
        else if (options.yes) {
            outputPath = "file-qr.png";
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("file-qr.png");
        }
        if (!outputPath) {
            console.log(chalk_1.default.yellow("\n⊘ Skipping file save\n"));
            await displayAscii(content, options.small);
            return;
        }
        const qrOptions = {
            errorCorrectionLevel: "L", // Use low correction for large data
            width: parseInt(options.size, 10),
            margin: 4,
        };
        await qrcode_1.default.toFile(outputPath, content, qrOptions);
        console.log(chalk_1.default.green("\n✓") + " QR code generated from file");
        console.log(chalk_1.default.gray("  Input:") + ` ${input}`);
        console.log(chalk_1.default.gray("  Output:") + ` ${outputPath}`);
        console.log(chalk_1.default.gray("  Content size:") + ` ${content.length} characters`);
        if (options.terminal) {
            await displayAscii(content, options.small);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("✗ Error generating QR code:"), error);
        process.exit(1);
    }
});
// Add help text
exports.qrCommands.addHelpText("after", qr_help_1.qrHelpText);
