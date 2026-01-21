import { Command } from "commander";
import crypto from "crypto";
import { readStdin } from "../../utils/stdin";
import { getSaveLocation } from "../../prompts/prompt-user";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export const hashCommand = new Command("hash")
  .description("Generate cryptographic hash from input")
  .argument("<algorithm>", "Hash algorithm (md5 | sha1 | sha256 | sha512)")
  .argument("[input]", "Input string to hash (reads from stdin if omitted)")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function (algorithm, input, { out, yes }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    // Validate algorithm
    const supportedAlgorithms = ["md5", "sha1", "sha256", "sha512"];
    if (!supportedAlgorithms.includes(algorithm.toLowerCase())) {
      console.error(chalk.red("✗ Unsupported hash algorithm"));
      console.log(chalk.gray("  Supported: md5, sha1, sha256, sha512"));
      process.exit(1);
    }

    // Get input data
    const data = input ?? (await readStdin());

    if (!data) {
      console.error(chalk.red("✗ No input provided"));
      console.log(chalk.gray("  Provide input as argument or via stdin"));
      process.exit(1);
    }

    // Generate hash
    const hash = crypto
      .createHash(algorithm.toLowerCase())
      .update(data)
      .digest("hex");

    // Format output
    let output: string;

    switch (format) {
      case "json":
        output = JSON.stringify(
          {
            algorithm: algorithm.toLowerCase(),
            hash,
            input: data,
            inputLength: data.length,
          },
          null,
          2
        );
        break;
      case "text":
      default:
        output = hash;
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
      const defaultFilename = format === "json" ? "hash.json" : "hash.txt";
      outputPath = await getSaveLocation(defaultFilename);
    }

    if (outputPath) {
      // Save to file
      const filePath = path.resolve(outputPath);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");

      console.log(chalk.green("\n✓") + " Hash saved to file");
      console.log(chalk.gray("  File:") + ` ${filePath}`);
      console.log(chalk.gray("  Algorithm:") + ` ${algorithm.toLowerCase()}`);
      console.log(chalk.gray("  Hash:") + ` ${hash}`);
    } else {
      // Output to stdout
      console.log(output);
    }
  });
