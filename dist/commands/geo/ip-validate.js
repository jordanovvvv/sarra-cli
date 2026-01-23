"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipValidateCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
// Validate IP address
exports.ipValidateCommand = new commander_1.Command("validate")
    .description("Validate an IP address (IPv4 or IPv6)")
    .argument("<ip>", "IP address to validate")
    .action(async function (ip) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    // IPv4 regex
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // IPv6 regex (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const isIPv4 = ipv4Regex.test(ip);
    const isIPv6 = ipv6Regex.test(ip);
    const isValid = isIPv4 || isIPv6;
    if (format === "json") {
        console.log(JSON.stringify({
            ip,
            valid: isValid,
            type: isIPv4 ? "IPv4" : isIPv6 ? "IPv6" : null,
        }, null, 2));
    }
    else {
        if (isValid) {
            console.log(chalk_1.default.green("✓ Valid IP address"));
            console.log(chalk_1.default.gray("  Type:"), chalk_1.default.white(isIPv4 ? "IPv4" : "IPv6"));
            console.log(chalk_1.default.gray("  Address:"), chalk_1.default.white(ip));
        }
        else {
            console.log(chalk_1.default.red("✗ Invalid IP address"));
            console.log(chalk_1.default.gray("  Input:"), chalk_1.default.white(ip));
        }
    }
    process.exit(isValid ? 0 : 1);
});
