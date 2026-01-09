import { Command } from "commander";

export const nowCommand = new Command("now")
  .description("Print the current timestamp")
  .option("--unix", "Output Unix timestamp (seconds)")
  .option("--ms", "Output Unix timestamp in milliseconds")
  .option(
    "--format <format>",
    "Custom output format (iso | date | time)",
    "iso"
  )
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

      case "iso":
      default:
        console.log(now.toISOString());
    }
  });
