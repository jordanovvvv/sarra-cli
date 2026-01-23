"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aesDecryptCommand = exports.aesEncryptCommand = void 0;
const commander_1 = require("commander");
const stdin_1 = require("../../utils/stdin");
const chalk_1 = __importDefault(require("chalk"));
const crypto_1 = __importDefault(require("crypto"));
const prompt_user_1 = require("../../prompts/prompt-user");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// AES Encryption Command
exports.aesEncryptCommand = new commander_1.Command("aes-encrypt")
    .description("Encrypt data using AES-256-GCM")
    .argument("[input]", "Input string to encrypt (reads from stdin if omitted)")
    .option("-k, --key <key>", "Encryption key (hex, 32 bytes). Auto-generated if omitted")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function (input, { key, out, yes }) {
    const parentOpts = this.parent?.opts();
    const format = parentOpts?.format ?? "text";
    // Get input data
    const data = input ?? (await (0, stdin_1.readStdin)());
    if (!data) {
        console.error(chalk_1.default.red("✗ No input provided"));
        console.log(chalk_1.default.gray("  Provide input as argument or via stdin"));
        process.exit(1);
    }
    // Generate or validate key
    let encryptionKey;
    if (key) {
        try {
            encryptionKey = Buffer.from(key, "hex");
            if (encryptionKey.length !== 32) {
                throw new Error("Key must be 32 bytes (64 hex characters)");
            }
        }
        catch (err) {
            console.error(chalk_1.default.red("✗ Invalid encryption key"));
            console.log(chalk_1.default.gray("  Key must be 64 hex characters (32 bytes)"));
            process.exit(1);
        }
    }
    else {
        encryptionKey = crypto_1.default.randomBytes(32);
    }
    // Generate IV
    const iv = crypto_1.default.randomBytes(16);
    // Encrypt
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", encryptionKey, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    // Format output
    let output;
    switch (format) {
        case "json":
            output = JSON.stringify({
                algorithm: "aes-256-gcm",
                encrypted,
                iv: iv.toString("hex"),
                authTag: authTag.toString("hex"),
                key: encryptionKey.toString("hex"),
            }, null, 2);
            break;
        case "text":
        default:
            output = `Encrypted: ${encrypted}\nIV: ${iv.toString("hex")}\nAuth Tag: ${authTag.toString("hex")}\nKey: ${encryptionKey.toString("hex")}`;
            break;
    }
    // Determine output method
    let outputPath;
    if (out) {
        outputPath = out;
    }
    else if (yes) {
        outputPath = null;
    }
    else {
        const defaultFilename = format === "json" ? "encrypted.json" : "encrypted.txt";
        outputPath = await (0, prompt_user_1.getSaveLocation)(defaultFilename);
    }
    if (outputPath) {
        const filePath = path_1.default.resolve(outputPath);
        const dir = path_1.default.dirname(filePath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(filePath, output + "\n", "utf8");
        console.log(chalk_1.default.green("\n✓") + " Data encrypted and saved");
        console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        console.log(chalk_1.default.gray("  Algorithm:") + " aes-256-gcm");
        console.log(chalk_1.default.yellow("  ⚠ Save the key securely to decrypt later!"));
    }
    else {
        console.log(output);
    }
});
// AES Decryption Command
exports.aesDecryptCommand = new commander_1.Command("aes-decrypt")
    .description("Decrypt data using AES-256-GCM")
    .argument("[input]", "Encrypted data (hex) (reads from stdin if omitted)")
    .requiredOption("-k, --key <key>", "Decryption key (hex, 32 bytes)")
    .requiredOption("-i, --iv <iv>", "Initialization vector (hex, 16 bytes)")
    .requiredOption("-t, --tag <tag>", "Auth tag (hex, 16 bytes)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function (input, { key, iv, tag, out, yes }) {
    // Get input data
    const encryptedData = input ?? (await (0, stdin_1.readStdin)());
    if (!encryptedData) {
        console.error(chalk_1.default.red("✗ No encrypted data provided"));
        process.exit(1);
    }
    try {
        // Parse inputs
        const decryptionKey = Buffer.from(key, "hex");
        const ivBuffer = Buffer.from(iv, "hex");
        const authTag = Buffer.from(tag, "hex");
        // Decrypt
        const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", decryptionKey, ivBuffer);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData.trim(), "hex", "utf8");
        decrypted += decipher.final("utf8");
        // Determine output method
        let outputPath;
        if (out) {
            outputPath = out;
        }
        else if (yes) {
            outputPath = null;
        }
        else {
            outputPath = await (0, prompt_user_1.getSaveLocation)("decrypted.txt");
        }
        if (outputPath) {
            const filePath = path_1.default.resolve(outputPath);
            const dir = path_1.default.dirname(filePath);
            fs_1.default.mkdirSync(dir, { recursive: true });
            fs_1.default.writeFileSync(filePath, decrypted, "utf8");
            console.log(chalk_1.default.green("\n✓") + " Data decrypted and saved");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        }
        else {
            console.log(decrypted);
        }
    }
    catch (err) {
        console.error(chalk_1.default.red("✗ Decryption failed"));
        console.log(chalk_1.default.gray("  Check that key, IV, and auth tag are correct"));
        process.exit(1);
    }
});
