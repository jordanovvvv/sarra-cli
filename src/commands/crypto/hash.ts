import { Command } from "commander";
import crypto from "crypto";
import { readStdin } from "../../utils/stdin";

export const hashCommand = new Command("hash")
  .description("Generate hash")
  .argument("<algorithm>", "md5 | sha1 | sha256")
  .argument("[input]")
  .action(async (algorithm, input) => {
    const data = input ?? (await readStdin());

    if (!data) {
      console.error("No input provided");
      process.exit(1);
    }

    const hash = crypto.createHash(algorithm).update(data).digest("hex");

    console.log(hash);

    // TODO: Add output for text, json and other formats
  });
