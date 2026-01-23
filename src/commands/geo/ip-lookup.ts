import { Command } from "commander";
import { httpsGet } from "../../help/httpRequests";
import chalk from "chalk";

// Lookup IP geolocation
export const ipLookupCommand = new Command("lookup")
  .description("Get geolocation information for an IP address")
  .argument("[ip]", "IP address to lookup (uses your IP if omitted)")
  .action(async function (ip) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    try {
      const endpoint = ip
        ? `https://ipapi.co/${ip}/json/`
        : "https://ipapi.co/json/";

      const data = await httpsGet(endpoint);

      if (data.error) {
        console.log(data);
        console.error(chalk.red("✗ Invalid IP address or lookup failed"));
        process.exit(1);
      }

      if (format === "json") {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(chalk.green("\n📍 IP Geolocation Information\n"));
        console.log(chalk.gray("  IP Address:"), chalk.white(data.ip));
        console.log(chalk.gray("  City:"), chalk.white(data.city || "N/A"));
        console.log(chalk.gray("  Region:"), chalk.white(data.region || "N/A"));
        console.log(
          chalk.gray("  Country:"),
          chalk.white(`${data.country_name} (${data.country_code})`),
        );
        console.log(
          chalk.gray("  Timezone:"),
          chalk.white(data.timezone || "N/A"),
        );
        console.log(chalk.gray("  ISP:"), chalk.white(data.org || "N/A"));
        console.log(chalk.gray("  Postal:"), chalk.white(data.postal || "N/A"));
        console.log(
          chalk.gray("  Coordinates:"),
          chalk.white(`${data.latitude}, ${data.longitude}`),
        );
      }
    } catch (err) {
      console.error(chalk.red("✗ Failed to lookup IP information"));
      process.exit(1);
    }
  });
