import { Command } from "commander";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export const randomCommand = new Command("random")
  .description("Generate cryptographically secure random tokens")
  .option(
    "-l, --length <number>",
    "Byte length (hex output is length × 2 characters)",
    "16"
  )
  .option("-c, --count <number>", "How many tokens to generate", "1")
  .option("-o, --out <file>", "Write output to a file instead of stdout")
  .action(function ({ length, count, out }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    const byteLength = Number(length);
    const tokenCount = Number(count);

    if (!Number.isInteger(byteLength) || byteLength <= 0) {
      console.error("❌ --length must be a positive integer");
      process.exit(1);
    }

    if (!Number.isInteger(tokenCount) || tokenCount <= 0) {
      console.error("❌ --count must be a positive integer");
      process.exit(1);
    }

    const tokens = Array.from({ length: tokenCount }, () =>
      crypto.randomBytes(byteLength).toString("hex")
    );

    let output: string;

    // Output formatting
    if (format === "json") {
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
    } else {
      output = tokens.join("\n");
    }

    // File or stdout
    if (out) {
      const filePath = path.resolve(out);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");
    } else {
      console.log(output);
    }
  });
