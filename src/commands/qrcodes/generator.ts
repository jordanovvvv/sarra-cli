// src/commands/qr.ts
import { Command } from "commander";
import QRCode from "qrcode";
import chalk from "chalk";
import * as fs from "fs";
import { qrHelpText } from "./qr-help";
import { getSaveLocation } from "../../prompts/prompt-user";
import path from "path";
import { prettyHelp } from "../../help/prettyHelp";

const helpPath = path.resolve(__dirname, "help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {}

export const qrCommands = new Command("qr").description(
  "QR code generation and utilities"
);

// Helper function to display ASCII QR code
async function displayAscii(text: string, small: boolean = true) {
  const ascii = await QRCode.toString(text, {
    type: "terminal",
    small: small,
  } as any);
  console.log("\n" + chalk.bold("Terminal Preview:"));
  console.log(ascii);
}

// Generate QR code from text
qrCommands
  .command("generate")
  .alias("gen")
  .description("Generate a QR code from text")
  .argument("<text>", "Text to encode in the QR code")
  .option("-o, --output <file>", "Output file path (skips prompt)")
  .option("-y, --yes", "Skip prompt and use default location", false)
  .option("-s, --size <pixels>", "Image width in pixels", "300")
  .option(
    "-e, --error-correction <level>",
    "Error correction level (L, M, Q, H)",
    "M"
  )
  .option("-t, --terminal", "Display ASCII representation in terminal", false)
  .option("--small", "Use small ASCII characters (with -t)", true)
  .option("--dark <color>", "Dark color (hex)", "#000000")
  .option("--light <color>", "Light color (hex)", "#FFFFFF")
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .action(async (text: string, options) => {
    try {
      const errorLevel = options.errorCorrection.toUpperCase();
      if (!["L", "M", "Q", "H"].includes(errorLevel)) {
        console.error(chalk.red("✗ Invalid error correction level"));
        console.log("  Use: L (7%), M (15%), Q (25%), or H (30%)");
        process.exit(1);
      }

      // Determine output path
      let outputPath: string | null;

      if (options.output) {
        // User provided -o flag, use it directly
        outputPath = options.output;
      } else if (options.yes) {
        // User used -y flag, use default
        outputPath = "qrcode.png";
      } else {
        // Ask user
        outputPath = await getSaveLocation("qrcode.png");
      }

      // If user chose not to save, only show terminal
      if (!outputPath) {
        console.log(chalk.yellow("\n⊘ Skipping file save\n"));
        await displayAscii(text, options.small);
        return;
      }

      const qrOptions = {
        errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
        width: parseInt(options.size, 10),
        margin: 4,
        color: {
          dark: options.dark,
          light: options.light,
        },
      };

      // Generate and save QR code
      await QRCode.toFile(outputPath, text, qrOptions);

      console.log(chalk.green("\n✓") + " QR code generated successfully");
      console.log(chalk.gray("  File:") + ` ${outputPath}`);
      console.log(chalk.gray("  Size:") + ` ${options.size}px`);
      console.log(chalk.gray("  Error correction:") + ` ${errorLevel}`);

      // Show ASCII version if requested
      if (options.terminal) {
        await displayAscii(text, options.small);
      }
    } catch (error) {
      console.error(chalk.red("✗ Error generating QR code:"), error);
      process.exit(1);
    }
  });

// Generate QR code to terminal only (no file output)
qrCommands
  .command("terminal")
  .alias("term")
  .description("Display QR code as ASCII art in terminal only (no file)")
  .argument("<text>", "Text to encode")
  .option("--small", "Use small characters", true)
  .action(async (text: string, options) => {
    try {
      await displayAscii(text, options.small);
      console.log(chalk.gray(`\nEncoded: "${text}"`));
    } catch (error) {
      console.error(chalk.red("✗ Error generating QR code:"), error);
      process.exit(1);
    }
  });

// Generate QR code from URL
qrCommands
  .command("url")
  .description("Generate QR code from a URL")
  .argument("<url>", "URL to encode")
  .option("-o, --output <file>", "Output file path (skips prompt)")
  .option("-y, --yes", "Skip prompt and use default location", false)
  .option("-s, --size <pixels>", "Image width in pixels", "400")
  .option("-t, --terminal", "Display ASCII representation in terminal", false)
  .option("--small", "Use small ASCII characters (with -t)", true)
  .action(async (url: string, options) => {
    try {
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        console.error(chalk.red("✗ Invalid URL format"));
        process.exit(1);
      }

      // Determine output path
      let outputPath: string | null;

      if (options.output) {
        outputPath = options.output;
      } else if (options.yes) {
        outputPath = "url-qr.png";
      } else {
        outputPath = await getSaveLocation("url-qr.png");
      }

      if (!outputPath) {
        console.log(chalk.yellow("\n⊘ Skipping file save\n"));
        await displayAscii(url, options.small);
        return;
      }

      const qrOptions = {
        errorCorrectionLevel: "M" as "M",
        width: parseInt(options.size, 10),
        margin: 4,
      };

      await QRCode.toFile(outputPath, url, qrOptions);

      console.log(chalk.green("\n✓") + " URL QR code generated");
      console.log(chalk.gray("  URL:") + ` ${url}`);
      console.log(chalk.gray("  File:") + ` ${outputPath}`);

      if (options.terminal) {
        await displayAscii(url, options.small);
      }
    } catch (error) {
      console.error(chalk.red("✗ Error generating QR code:"), error);
      process.exit(1);
    }
  });

// Generate QR code from file content
qrCommands
  .command("file")
  .description("Generate QR code from file content")
  .argument("<input>", "Input file to read")
  .option("-o, --output <file>", "Output QR code file (skips prompt)")
  .option("-y, --yes", "Skip prompt and use default location", false)
  .option("-s, --size <pixels>", "Image width in pixels", "400")
  .option("-t, --terminal", "Display ASCII representation in terminal", false)
  .option("--small", "Use small ASCII characters (with -t)", true)
  .action(async (input: string, options) => {
    try {
      if (!fs.existsSync(input)) {
        console.error(chalk.red("✗ Input file not found:"), input);
        process.exit(1);
      }

      const content = fs.readFileSync(input, "utf-8");

      if (content.length > 2953) {
        console.warn(
          chalk.yellow("⚠ Warning: Content may be too large for QR code")
        );
        console.log(chalk.gray("  Maximum recommended: ~2953 characters"));
      }

      // Determine output path
      let outputPath: string | null;

      if (options.output) {
        outputPath = options.output;
      } else if (options.yes) {
        outputPath = "file-qr.png";
      } else {
        outputPath = await getSaveLocation("file-qr.png");
      }

      if (!outputPath) {
        console.log(chalk.yellow("\n⊘ Skipping file save\n"));
        await displayAscii(content, options.small);
        return;
      }

      const qrOptions = {
        errorCorrectionLevel: "L" as "L", // Use low correction for large data
        width: parseInt(options.size, 10),
        margin: 4,
      };

      await QRCode.toFile(outputPath, content, qrOptions);

      console.log(chalk.green("\n✓") + " QR code generated from file");
      console.log(chalk.gray("  Input:") + ` ${input}`);
      console.log(chalk.gray("  Output:") + ` ${outputPath}`);
      console.log(
        chalk.gray("  Content size:") + ` ${content.length} characters`
      );

      if (options.terminal) {
        await displayAscii(content, options.small);
      }
    } catch (error) {
      console.error(chalk.red("✗ Error generating QR code:"), error);
      process.exit(1);
    }
  });

// Add help text
qrCommands.addHelpText("after", qrHelpText);
