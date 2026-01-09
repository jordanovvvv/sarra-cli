"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCommand = void 0;
const commander_1 = require("commander");
const crypto_1 = __importDefault(require("crypto"));
const stdin_1 = require("../../utils/stdin");
exports.hashCommand = new commander_1.Command("hash")
    .description("Generate hash")
    .argument("<algorithm>", "md5 | sha1 | sha256")
    .argument("[input]")
    .action(async (algorithm, input) => {
    const data = input ?? (await (0, stdin_1.readStdin)());
    if (!data) {
        console.error("No input provided");
        process.exit(1);
    }
    const hash = crypto_1.default.createHash(algorithm).update(data).digest("hex");
    console.log(hash);
    // TODO: Add output for text, json and other formats
});
