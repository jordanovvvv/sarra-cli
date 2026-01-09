import { Command } from "commander";
import { readStdin } from "../../utils/stdin";

export const base64Command = new Command("base64")
  .description("Base64 encode or decode data")
  .option("--decode", "Decode base64 input")
  .argument("[input]", "Input string (reads from stdin if omitted)")
  .action(async (input, options) => {
    const data = input ?? (await readStdin());

    if (!data) {
      console.error("No input provided");
      process.exit(1);
    }

    try {
      const result = options.decode
        ? Buffer.from(data, "base64").toString("utf8")
        : Buffer.from(data, "utf8").toString("base64");

      console.log(result);
    } catch {
      console.error("Invalid base64 input");
      process.exit(1);
    }

    // TODO: Add output for text, json and other formats
  });
