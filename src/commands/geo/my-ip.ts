import { Command } from "commander";
import { httpsGet } from "../../help/httpRequests";
import chalk from "chalk";

// Get current public IP
export const myIpCommand = new Command("my-ip")
  .description("Get your current public IP address")
  .option("-4, --ipv4", "Show only IPv4 address", false)
  .option("-6, --ipv6", "Show only IPv6 address", false)
  .action(async function ({ ipv4, ipv6 }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    try {
      let endpoint = "https://api.ipify.org?format=json";

      if (ipv6) {
        endpoint = "https://api64.ipify.org?format=json";
      }

      const data = await httpsGet(endpoint);

      if (format === "json") {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(chalk.cyan("Public IP:"), chalk.white(data.ip));
      }
    } catch (err) {
      console.error(chalk.red("✗ Failed to retrieve IP address"));
      process.exit(1);
    }
  });
