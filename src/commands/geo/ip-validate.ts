import chalk from "chalk";
import { Command } from "commander";

// Validate IP address
export const ipValidateCommand = new Command("validate")
  .description("Validate an IP address (IPv4 or IPv6)")
  .argument("<ip>", "IP address to validate")
  .action(async function (ip) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    // IPv4 regex
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // IPv6 regex (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    const isIPv4 = ipv4Regex.test(ip);
    const isIPv6 = ipv6Regex.test(ip);
    const isValid = isIPv4 || isIPv6;

    if (format === "json") {
      console.log(
        JSON.stringify(
          {
            ip,
            valid: isValid,
            type: isIPv4 ? "IPv4" : isIPv6 ? "IPv6" : null,
          },
          null,
          2,
        ),
      );
    } else {
      if (isValid) {
        console.log(chalk.green("✓ Valid IP address"));
        console.log(
          chalk.gray("  Type:"),
          chalk.white(isIPv4 ? "IPv4" : "IPv6"),
        );
        console.log(chalk.gray("  Address:"), chalk.white(ip));
      } else {
        console.log(chalk.red("✗ Invalid IP address"));
        console.log(chalk.gray("  Input:"), chalk.white(ip));
      }
    }

    process.exit(isValid ? 0 : 1);
  });
