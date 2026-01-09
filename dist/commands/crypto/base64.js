"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Command = void 0;
const commander_1 = require("commander");
const stdin_1 = require("../../utils/stdin");
exports.base64Command = new commander_1.Command("base64")
    .description("Base64 encode or decode data")
    .option("--decode", "Decode base64 input")
    .argument("[input]", "Input string (reads from stdin if omitted)")
    .action(async (input, options) => {
    const data = input ?? (await (0, stdin_1.readStdin)());
    if (!data) {
        console.error("No input provided");
        process.exit(1);
    }
    try {
        const result = options.decode
            ? Buffer.from(data, "base64").toString("utf8")
            : Buffer.from(data, "utf8").toString("base64");
        console.log(result);
    }
    catch {
        console.error("Invalid base64 input");
        process.exit(1);
    }
    // TODO: Add output for text, json and other formats
});
