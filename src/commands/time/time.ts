import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import { prettyHelp } from "../../help/prettyHelp";

const helpPath = path.resolve(__dirname, "../../docs/time-help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {
  helpText = "";
}

export const timeCommands = new Command("time").description(
  "Date and time utilities"
);

// Current timestamp
timeCommands
  .command("now")
  .description("Print the current timestamp")
  .option("--unix", "Output Unix timestamp (seconds)")
  .option("--ms", "Output Unix timestamp in milliseconds")
  .option(
    "--format <format>",
    "Custom output format (iso | date | time | locale)",
    "iso"
  )
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .action(({ unix, ms, format }) => {
    const now = new Date();

    if (unix) {
      console.log(Math.floor(now.getTime() / 1000));
      return;
    }

    if (ms) {
      console.log(now.getTime());
      return;
    }

    switch (format) {
      case "date":
        console.log(now.toISOString().split("T")[0]);
        break;

      case "time":
        console.log(now.toISOString().split("T")[1].replace("Z", ""));
        break;

      case "locale":
        console.log(now.toLocaleString());
        break;

      case "iso":
      default:
        console.log(now.toISOString());
    }
  });

// Convert timestamp
timeCommands
  .command("convert")
  .alias("conv")
  .description("Convert between timestamp formats")
  .argument(
    "<timestamp>",
    "Timestamp to convert (Unix seconds, Unix ms, or ISO string)"
  )
  .option(
    "--to <format>",
    "Output format (iso | unix | ms | date | time | locale)",
    "iso"
  )
  .action((timestamp, { to }) => {
    try {
      let date: Date;

      // Determine input format and parse
      if (/^\d+$/.test(timestamp)) {
        const num = parseInt(timestamp, 10);
        // If less than 10 billion, assume seconds; otherwise milliseconds
        date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) {
        console.error(chalk.red("✗ Invalid timestamp"));
        process.exit(1);
      }

      switch (to) {
        case "unix":
          console.log(Math.floor(date.getTime() / 1000));
          break;

        case "ms":
          console.log(date.getTime());
          break;

        case "date":
          console.log(date.toISOString().split("T")[0]);
          break;

        case "time":
          console.log(date.toISOString().split("T")[1].replace("Z", ""));
          break;

        case "locale":
          console.log(date.toLocaleString());
          break;

        case "iso":
        default:
          console.log(date.toISOString());
      }
    } catch (error) {
      console.error(chalk.red("✗ Error converting timestamp"));
      process.exit(1);
    }
  });

// Add/subtract time
timeCommands
  .command("add")
  .description("Add time to a timestamp or current time")
  .argument("[timestamp]", "Base timestamp (defaults to now)")
  .option("-s, --seconds <n>", "Add seconds", "0")
  .option("-m, --minutes <n>", "Add minutes", "0")
  .option("-h, --hours <n>", "Add hours", "0")
  .option("-d, --days <n>", "Add days", "0")
  .option("--format <format>", "Output format (iso | unix | ms | date)", "iso")
  .action((timestamp, { seconds, minutes, hours, days, format }) => {
    try {
      const base = timestamp ? new Date(timestamp) : new Date();

      if (isNaN(base.getTime())) {
        console.error(chalk.red("✗ Invalid timestamp"));
        process.exit(1);
      }

      const result = new Date(base);
      result.setSeconds(result.getSeconds() + parseInt(seconds, 10));
      result.setMinutes(result.getMinutes() + parseInt(minutes, 10));
      result.setHours(result.getHours() + parseInt(hours, 10));
      result.setDate(result.getDate() + parseInt(days, 10));

      switch (format) {
        case "unix":
          console.log(Math.floor(result.getTime() / 1000));
          break;

        case "ms":
          console.log(result.getTime());
          break;

        case "date":
          console.log(result.toISOString().split("T")[0]);
          break;

        case "iso":
        default:
          console.log(result.toISOString());
      }
    } catch (error) {
      console.error(chalk.red("✗ Error adding time"));
      process.exit(1);
    }
  });

// Time difference
timeCommands
  .command("diff")
  .description("Calculate time difference between two timestamps")
  .argument("<timestamp1>", "First timestamp")
  .argument("<timestamp2>", "Second timestamp (defaults to now)")
  .option(
    "--unit <unit>",
    "Output unit (ms | seconds | minutes | hours | days)",
    "seconds"
  )
  .option("--abs", "Absolute value (always positive)", false)
  .action((timestamp1, timestamp2, { unit, abs }) => {
    try {
      const date1 = new Date(timestamp1);
      const date2 = timestamp2 ? new Date(timestamp2) : new Date();

      if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        console.error(chalk.red("✗ Invalid timestamp"));
        process.exit(1);
      }

      let diff = date2.getTime() - date1.getTime();

      if (abs) {
        diff = Math.abs(diff);
      }

      switch (unit) {
        case "seconds":
          console.log(Math.floor(diff / 1000));
          break;

        case "minutes":
          console.log(Math.floor(diff / 1000 / 60));
          break;

        case "hours":
          console.log(Math.floor(diff / 1000 / 60 / 60));
          break;

        case "days":
          console.log(Math.floor(diff / 1000 / 60 / 60 / 24));
          break;

        case "ms":
        default:
          console.log(diff);
      }
    } catch (error) {
      console.error(chalk.red("✗ Error calculating difference"));
      process.exit(1);
    }
  });

// Parse and validate
timeCommands
  .command("parse")
  .description("Parse and validate a timestamp")
  .argument("<timestamp>", "Timestamp to parse")
  .option("--verbose", "Show detailed information", false)
  .action((timestamp, { verbose }) => {
    try {
      let date: Date;

      if (/^\d+$/.test(timestamp)) {
        const num = parseInt(timestamp, 10);
        date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) {
        console.error(chalk.red("✗ Invalid timestamp"));
        process.exit(1);
      }

      if (verbose) {
        console.log(chalk.green("✓ Valid timestamp"));
        console.log(chalk.gray("  ISO 8601:") + ` ${date.toISOString()}`);
        console.log(
          chalk.gray("  Unix (s):") + ` ${Math.floor(date.getTime() / 1000)}`
        );
        console.log(chalk.gray("  Unix (ms):") + ` ${date.getTime()}`);
        console.log(
          chalk.gray("  Date:") + ` ${date.toISOString().split("T")[0]}`
        );
        console.log(
          chalk.gray("  Time:") +
            ` ${date.toISOString().split("T")[1].replace("Z", "")}`
        );
        console.log(chalk.gray("  Locale:") + ` ${date.toLocaleString()}`);
      } else {
        console.log(date.toISOString());
      }
    } catch (error) {
      console.error(chalk.red("✗ Error parsing timestamp"));
      process.exit(1);
    }
  });
