"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = __importDefault(require("qrcode"));
const chalk_1 = __importDefault(require("chalk"));
// Display ASCII QR code
async function displayAscii(text, small = true) {
    const ascii = await qrcode_1.default.toString(text, {
        type: "terminal",
        small: small,
    });
    console.log("\n" + chalk_1.default.bold("Terminal Preview:"));
    console.log(ascii);
}
exports.default = displayAscii;
