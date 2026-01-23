"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
// Get local network information
exports.localCommand = new commander_1.Command("local")
    .description("Get local network interface information")
    .action(async function () {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    const os = await Promise.resolve().then(() => __importStar(require("os")));
    const interfaces = os.networkInterfaces();
    const result = [];
    for (const [name, addrs] of Object.entries(interfaces)) {
        if (!addrs)
            continue;
        for (const addr of addrs) {
            if (addr.internal)
                continue; // Skip loopback
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
    }
    else {
        console.log(chalk_1.default.green("\n🌐 Local Network Interfaces\n"));
        if (result.length === 0) {
            console.log(chalk_1.default.gray("  No external network interfaces found"));
        }
        else {
            result.forEach((item, idx) => {
                console.log(chalk_1.default.cyan(`  [${idx + 1}] ${item.interface}`));
                console.log(chalk_1.default.gray("      Address:"), chalk_1.default.white(item.address));
                console.log(chalk_1.default.gray("      Type:"), chalk_1.default.white(item.family));
                console.log(chalk_1.default.gray("      MAC:"), chalk_1.default.white(item.mac));
                console.log();
            });
        }
    }
});
