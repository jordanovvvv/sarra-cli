import { Command } from "commander";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getSaveLocation } from "../../prompts/prompt-user";
import chalk from "chalk";

export const randomCommand = new Command("random")
  .description("Generate cryptographically secure random tokens")
  .option(
    "-l, --length <number>",
    "Byte length (hex output is length × 2 characters)",
    "16"
  )
  .option("-c, --count <number>", "How many tokens to generate", "1")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function ({ length, count, out, yes }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    const byteLength = Number(length);
    const tokenCount = Number(count);

    if (!Number.isInteger(byteLength) || byteLength <= 0) {
      console.error(chalk.red("✗ --length must be a positive integer"));
      process.exit(1);
    }

    if (!Number.isInteger(tokenCount) || tokenCount <= 0) {
      console.error(chalk.red("✗ --count must be a positive integer"));
      process.exit(1);
    }

    const tokens = Array.from({ length: tokenCount }, () =>
      crypto.randomBytes(byteLength).toString("hex")
    );

    let output: string;

    switch (format) {
      case "json":
        output = JSON.stringify(
          {
            tokens,
            count: tokenCount,
            length: byteLength,
            encoding: "hex",
          },
          null,
          2
        );
        break;
      case "text":
      default:
        output = tokens.join("\n");
        break;
    }

    // Determine output method
    let outputPath: string | null;

    if (out) {
      // User provided -o flag, use it directly
      outputPath = out;
    } else if (yes) {
      // User used -y flag, output to stdout
      outputPath = null;
    } else {
      // Ask user
      const defaultFilename = format === "json" ? "tokens.json" : "tokens.txt";
      outputPath = await getSaveLocation(defaultFilename);
    }

    if (outputPath) {
      // Save to file
      const filePath = path.resolve(outputPath);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");

      console.log(chalk.green("\n✓") + " Random tokens saved to file");
      console.log(chalk.gray("  File:") + ` ${filePath}`);
      console.log(chalk.gray("  Count:") + ` ${tokenCount}`);
      console.log(chalk.gray("  Byte length:") + ` ${byteLength}`);
      console.log(
        chalk.gray("  Hex length:") + ` ${byteLength * 2} characters`
      );
    } else {
      // Output to stdout
      console.log(output);
    }
  });
