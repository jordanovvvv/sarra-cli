"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myIpCommand = void 0;
const commander_1 = require("commander");
const httpRequests_1 = require("../../help/httpRequests");
const chalk_1 = __importDefault(require("chalk"));
// Get current public IP
exports.myIpCommand = new commander_1.Command("my-ip")
    .description("Get your current public IP address")
    .option("-4, --ipv4", "Show only IPv4 address", false)
    .option("-6, --ipv6", "Show only IPv6 address", false)
    .action(async function ({ ipv4, ipv6 }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    try {
        let endpoint = "https://api.ipify.org?format=json";
        if (ipv6) {
            endpoint = "https://api64.ipify.org?format=json";
        }
        const data = await (0, httpRequests_1.httpsGet)(endpoint);
        if (format === "json") {
            console.log(JSON.stringify(data, null, 2));
        }
        else {
            console.log(chalk_1.default.cyan("Public IP:"), chalk_1.default.white(data.ip));
        }
    }
    catch (err) {
        console.error(chalk_1.default.red("✗ Failed to retrieve IP address"));
        process.exit(1);
    }
});
