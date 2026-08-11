"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipValidateCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const net_1 = require("net");
// Validate IP address
exports.ipValidateCommand = new commander_1.Command("validate")
    .description("Validate an IP address (IPv4 or IPv6)")
    .argument("<ip>", "IP address to validate")
    .action(async function (ip) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    const ipVersion = (0, net_1.isIP)(ip);
    const isIPv4 = ipVersion === 4;
    const isIPv6 = ipVersion === 6;
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
