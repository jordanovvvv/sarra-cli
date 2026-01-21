import { Command } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { readStdin } from "../../utils/stdin";
import { getSaveLocation } from "../../prompts/prompt-user";

export const jsonCommand = new Command("json").description("JSON utilities");

// Format/Pretty-print JSON
jsonCommand
  .command("format")
  .alias("pretty")
  .description("Pretty-print JSON with configurable indentation")
  .argument("[file]", "JSON file (reads from stdin if omitted)")
  .option("-i, --indent <spaces>", "Number of spaces for indentation", "2")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async (file, { indent, out, yes }) => {
    const input = file ? fs.readFileSync(file, "utf8") : await readStdin();

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, parseInt(indent));

      // Determine output method
      let outputPath: string | null;

      if (out) {
        outputPath = out;
      } else if (yes) {
        outputPath = null;
      } else {
        outputPath = await getSaveLocation("formatted.json");
      }

      if (outputPath) {
        const filePath = path.resolve(outputPath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, formatted + "\n", "utf8");

        console.log(chalk.green("\n✓") + " JSON formatted and saved");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
      } else {
        console.log(formatted);
      }
    } catch (error) {
      console.error(chalk.red("✗ Invalid JSON input"));
      process.exit(1);
    }
  });

// Minify JSON
jsonCommand
  .command("minify")
  .alias("min")
  .description("Minify JSON (remove whitespace)")
  .argument("[file]", "JSON file (reads from stdin if omitted)")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async (file, { out, yes }) => {
    const input = file ? fs.readFileSync(file, "utf8") : await readStdin();

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);

      let outputPath: string | null;

      if (out) {
        outputPath = out;
      } else if (yes) {
        outputPath = null;
      } else {
        outputPath = await getSaveLocation("minified.json");
      }

      if (outputPath) {
        const filePath = path.resolve(outputPath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, minified, "utf8");

        console.log(chalk.green("\n✓") + " JSON minified and saved");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
        console.log(
          chalk.gray("  Size reduction:") +
            ` ${input.length} → ${minified.length} bytes`
        );
      } else {
        console.log(minified);
      }
    } catch (error) {
      console.error(chalk.red("✗ Invalid JSON input"));
      process.exit(1);
    }
  });

// Validate JSON
jsonCommand
  .command("validate")
  .alias("check")
  .description("Validate JSON syntax")
  .argument("[file]", "JSON file (reads from stdin if omitted)")
  .action(async (file) => {
    const input = file ? fs.readFileSync(file, "utf8") : await readStdin();

    try {
      JSON.parse(input);
      console.log(chalk.green("✓ Valid JSON"));
    } catch (error: any) {
      console.error(chalk.red("✗ Invalid JSON"));
      console.log(chalk.gray("  Error:") + ` ${error.message}`);
      process.exit(1);
    }
  });

// Query/Extract JSON path
jsonCommand
  .command("query")
  .alias("get")
  .description("Extract value from JSON using dot notation path")
  .argument("<path>", "JSON path (e.g., 'user.name' or 'items[0].id')")
  .argument("[file]", "JSON file (reads from stdin if omitted)")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async (jsonPath, file, { out, yes }) => {
    const input = file ? fs.readFileSync(file, "utf8") : await readStdin();

    try {
      const parsed = JSON.parse(input);

      // Simple path resolver (supports dot notation and array indices)
      const value = jsonPath
        .split(/\.|\[|\]/)
        .filter(Boolean)
        .reduce((obj: any, key: string) => {
          return obj?.[key];
        }, parsed);

      if (value === undefined) {
        console.error(chalk.red("✗ Path not found in JSON"));
        process.exit(1);
      }

      const output =
        typeof value === "object"
          ? JSON.stringify(value, null, 2)
          : String(value);

      let outputPath: string | null;

      if (out) {
        outputPath = out;
      } else if (yes) {
        outputPath = null;
      } else {
        outputPath = await getSaveLocation("query-result.json");
      }

      if (outputPath) {
        const filePath = path.resolve(outputPath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, output + "\n", "utf8");

        console.log(chalk.green("\n✓") + " Query result saved");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(chalk.red("✗ Invalid JSON input or path"));
      process.exit(1);
    }
  });

// Merge JSON files
jsonCommand
  .command("merge")
  .description("Merge multiple JSON objects")
  .argument("<files...>", "JSON files to merge")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async (files, { out, yes }) => {
    try {
      const objects = files.map((file: string) => {
        const content = fs.readFileSync(file, "utf8");
        return JSON.parse(content);
      });

      const merged = Object.assign({}, ...objects);
      const output = JSON.stringify(merged, null, 2);

      let outputPath: string | null;

      if (out) {
        outputPath = out;
      } else if (yes) {
        outputPath = null;
      } else {
        outputPath = await getSaveLocation("merged.json");
      }

      if (outputPath) {
        const filePath = path.resolve(outputPath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, output + "\n", "utf8");

        console.log(chalk.green("\n✓") + " JSON files merged");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
        console.log(chalk.gray("  Merged:") + ` ${files.length} files`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(chalk.red("✗ Error merging JSON files"));
      console.error(
        chalk.gray("  Ensure all files contain valid JSON objects")
      );
      process.exit(1);
    }
  });

// Convert to/from other formats
jsonCommand
  .command("to-csv")
  .description("Convert JSON array to CSV")
  .argument(
    "[file]",
    "JSON file with array of objects (reads from stdin if omitted)"
  )
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async (file, { out, yes }) => {
    const input = file ? fs.readFileSync(file, "utf8") : await readStdin();

    try {
      const parsed = JSON.parse(input);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.error(chalk.red("✗ Input must be a non-empty JSON array"));
        process.exit(1);
      }

      // Get all unique keys from all objects
      const keys = Array.from(new Set(parsed.flatMap(Object.keys)));

      // Create CSV
      const csvRows = [
        keys.join(","),
        ...parsed.map((obj: any) =>
          keys
            .map((key) => {
              const value = obj[key];
              const stringValue =
                value === null || value === undefined ? "" : String(value);
              // Escape quotes and wrap in quotes if contains comma or quote
              return stringValue.includes(",") || stringValue.includes('"')
                ? `"${stringValue.replace(/"/g, '""')}"`
                : stringValue;
            })
            .join(",")
        ),
      ];

      const csv = csvRows.join("\n");

      let outputPath: string | null;

      if (out) {
        outputPath = out;
      } else if (yes) {
        outputPath = null;
      } else {
        outputPath = await getSaveLocation("output.csv");
      }

      if (outputPath) {
        const filePath = path.resolve(outputPath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, csv + "\n", "utf8");

        console.log(chalk.green("\n✓") + " JSON converted to CSV");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
        console.log(chalk.gray("  Rows:") + ` ${parsed.length}`);
      } else {
        console.log(csv);
      }
    } catch (error) {
      console.error(chalk.red("✗ Error converting to CSV"));
      process.exit(1);
    }
  });
