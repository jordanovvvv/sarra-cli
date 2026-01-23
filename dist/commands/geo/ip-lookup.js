"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipLookupCommand = void 0;
const commander_1 = require("commander");
const httpRequests_1 = require("../../help/httpRequests");
const chalk_1 = __importDefault(require("chalk"));
// Lookup IP geolocation
exports.ipLookupCommand = new commander_1.Command("lookup")
    .description("Get geolocation information for an IP address")
    .argument("[ip]", "IP address to lookup (uses your IP if omitted)")
    .action(async function (ip) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    try {
        const endpoint = ip
            ? `https://ipapi.co/${ip}/json/`
            : "https://ipapi.co/json/";
        const data = await (0, httpRequests_1.httpsGet)(endpoint);
        if (data.error) {
            console.log(data);
            console.error(chalk_1.default.red("✗ Invalid IP address or lookup failed"));
            process.exit(1);
        }
        if (format === "json") {
            console.log(JSON.stringify(data, null, 2));
        }
        else {
            console.log(chalk_1.default.green("\n📍 IP Geolocation Information\n"));
            console.log(chalk_1.default.gray("  IP Address:"), chalk_1.default.white(data.ip));
            console.log(chalk_1.default.gray("  City:"), chalk_1.default.white(data.city || "N/A"));
            console.log(chalk_1.default.gray("  Region:"), chalk_1.default.white(data.region || "N/A"));
            console.log(chalk_1.default.gray("  Country:"), chalk_1.default.white(`${data.country_name} (${data.country_code})`));
            console.log(chalk_1.default.gray("  Timezone:"), chalk_1.default.white(data.timezone || "N/A"));
            console.log(chalk_1.default.gray("  ISP:"), chalk_1.default.white(data.org || "N/A"));
            console.log(chalk_1.default.gray("  Postal:"), chalk_1.default.white(data.postal || "N/A"));
            console.log(chalk_1.default.gray("  Coordinates:"), chalk_1.default.white(`${data.latitude}, ${data.longitude}`));
        }
    }
    catch (err) {
        console.error(chalk_1.default.red("✗ Failed to lookup IP information"));
        process.exit(1);
    }
});
