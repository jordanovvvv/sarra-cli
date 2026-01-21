import { Command } from "commander";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { uuidV7 } from "./versions/uuidv7/generateUUID";
import chalk from "chalk";
import { getSaveLocation } from "../../prompts/prompt-user";

export const uuidCommand = new Command("uuid")
  .description("Generate UUIDs (v4 by default, v7 supported)")
  .option(
    "--uuid-version <version>",
    "UUID version to generate (v4 | v7)",
    "v4"
  )
  .option("-c, --count <number>", "How many UUIDs", "1")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function ({ uuidVersion, count, out, yes }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    const uuids: string[] = [];

    for (let i = 0; i < Number(count); i++) {
      if (uuidVersion === "v7") {
        uuids.push(uuidV7());
      } else if (uuidVersion === "v4") {
        uuids.push(crypto.randomUUID());
      } else {
        console.error(chalk.red(`✗ Unsupported UUID version: ${uuidVersion}`));
        console.info(chalk.yellow("  Generating UUID v4 (random) instead."));
        uuids.push(crypto.randomUUID());
      }
    }

    let output: string;

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
    let outputPath: string | null;

    if (out) {
      // User provided -o flag, use it directly
      outputPath = out;
    } else if (yes) {
      // User used -y flag, output to stdout
      outputPath = null;
    } else {
      // Ask user
      const defaultFilename = format === "json" ? "uuids.json" : "uuids.txt";
      outputPath = await getSaveLocation(defaultFilename);
    }

    if (outputPath) {
      // Save to file
      const filePath = path.resolve(outputPath);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");

      console.log(chalk.green("\n✓") + " UUIDs saved to file");
      console.log(chalk.gray("  File:") + ` ${filePath}`);
      console.log(chalk.gray("  Count:") + ` ${count}`);
      console.log(chalk.gray("  Version:") + ` ${uuidVersion}`);
    } else {
      // Output to stdout
      console.log(output);
    }
  });
