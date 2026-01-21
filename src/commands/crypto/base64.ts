import { Command } from "commander";
import { readStdin } from "../../utils/stdin";
import { getSaveLocation } from "../../prompts/prompt-user";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export const base64Command = new Command("base64")
  .description("Base64 encode or decode data")
  .argument("[input]", "Input string (reads from stdin if omitted)")
  .option("-d, --decode", "Decode base64 input", false)
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function (input, { decode, out, yes }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    // Get input data
    const data = input ?? (await readStdin());

    if (!data) {
      console.error(chalk.red("✗ No input provided"));
      console.log(chalk.gray("  Provide input as argument or via stdin"));
      process.exit(1);
    }

    // Encode or decode
    let result: string;
    let operation: string;

    try {
      if (decode) {
        result = Buffer.from(data.trim(), "base64").toString("utf8");
        operation = "decode";
      } else {
        result = Buffer.from(data, "utf8").toString("base64");
        operation = "encode";
      }
    } catch (error) {
      console.error(chalk.red("✗ Invalid base64 input"));
      console.log(
        chalk.gray("  Ensure the input is valid base64 when decoding")
      );
      process.exit(1);
    }

    // Format output
    let output: string;

    switch (format) {
      case "json":
        output = JSON.stringify(
          {
            operation,
            input: data,
            output: result,
            inputLength: data.length,
            outputLength: result.length,
          },
          null,
          2
        );
        break;
      case "text":
      default:
        output = result;
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
      const defaultFilename = format === "json" ? "base64.json" : "base64.txt";
      outputPath = await getSaveLocation(defaultFilename);
    }

    if (outputPath) {
      // Save to file
      const filePath = path.resolve(outputPath);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");

      console.log(chalk.green("\n✓") + ` Base64 ${operation} saved to file`);
      console.log(chalk.gray("  File:") + ` ${filePath}`);
      console.log(chalk.gray("  Operation:") + ` ${operation}`);
      console.log(chalk.gray("  Input length:") + ` ${data.length} chars`);
      console.log(chalk.gray("  Output length:") + ` ${result.length} chars`);
    } else {
      // Output to stdout
      console.log(output);
    }
  });
