import { Command } from "commander";
import fs from "fs";
import { readStdin } from "../../utils/stdin";

export const jsonCommand = new Command("json").description("JSON utilities");

jsonCommand
  .command("format")
  .description("Pretty-print JSON")
  .argument("[file]", "JSON file (reads from stdin if omitted)")
  .action(async (file) => {
    const input = file ? fs.readFileSync(file, "utf8") : await readStdin();

    try {
      const parsed = JSON.parse(input);
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.error("Invalid JSON input");
      process.exit(1);
    }

    // TODO: Add output for text, json and other formats
  });
