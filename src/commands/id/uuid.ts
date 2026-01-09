import { Command } from "commander";
import crypto from "crypto";
import fs from "fs";
import path from "path";

function uuidV7(): string {
  const now = Date.now(); // milliseconds since Unix epoch

  // 48-bit timestamp
  const timeHex = now.toString(16).padStart(12, "0");

  // 80 bits of randomness
  const rand = crypto.randomBytes(10).toString("hex");

  // UUID v7 format:
  // time(12) - time(4) - version(1) + rand(3) - variant(1) + rand(3) - rand(12)
  return (
    timeHex.slice(0, 8) +
    "-" +
    timeHex.slice(8, 12) +
    "-" +
    "7" +
    rand.slice(0, 3) +
    "-" +
    ((parseInt(rand.slice(3, 4), 16) & 0x3) | 0x8).toString(16) +
    rand.slice(4, 7) +
    "-" +
    rand.slice(7, 19)
  );
}

export const uuidCommand = new Command("uuid")
  .description("Generate UUIDs (v4 by default, v7 supported)")
  .option(
    "--uuid-version <version>",
    "UUID version to generate (v4 | v7)",
    "v4"
  )
  .option("-c, --count <number>", "How many UUIDs", "1")
  .option("-o, --out <file>", "Write output to a file instead of stdout")
  .action(function ({ uuidVersion, count, out }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    const uuids: string[] = [];

    for (let i = 0; i < Number(count); i++) {
      if (uuidVersion === "v7") {
        uuids.push(uuidV7());
      } else if (uuidVersion === "v4") {
        uuids.push(crypto.randomUUID());
      } else {
        console.error(
          `Error: Unsupported UUID version: ${uuidVersion}. Supported versions are v4 and v7.`
        );
        console.info("Generating UUID v4 (random) instead.");
        uuids.push(crypto.randomUUID());
      }
    }

    const output =
      format === "json"
        ? JSON.stringify({ version: uuidVersion, uuids }, null, 2)
        : uuids.join("\n");

    if (out) {
      const filePath = path.resolve(out);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");
    } else {
      console.log(output);
    }
  });
