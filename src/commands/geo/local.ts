import chalk from "chalk";
import { Command } from "commander";

// Get local network information
export const localCommand = new Command("local")
  .description("Get local network interface information")
  .action(async function () {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";
    const os = await import("os");
    const interfaces = os.networkInterfaces();

    const result: any[] = [];

    for (const [name, addrs] of Object.entries(interfaces)) {
      if (!addrs) continue;

      for (const addr of addrs) {
        if (addr.internal) continue; // Skip loopback

        result.push({
          interface: name,
          address: addr.address,
          family: addr.family,
          mac: addr.mac,
        });
      }
    }

    if (format === "json") {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(chalk.green("\n🌐 Local Network Interfaces\n"));

      if (result.length === 0) {
        console.log(chalk.gray("  No external network interfaces found"));
      } else {
        result.forEach((item, idx) => {
          console.log(chalk.cyan(`  [${idx + 1}] ${item.interface}`));
          console.log(chalk.gray("      Address:"), chalk.white(item.address));
          console.log(chalk.gray("      Type:"), chalk.white(item.family));
          console.log(chalk.gray("      MAC:"), chalk.white(item.mac));
          console.log();
        });
      }
    }
  });
