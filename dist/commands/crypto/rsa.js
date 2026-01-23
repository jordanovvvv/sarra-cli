"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsaKeygenCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prompt_user_1 = require("../../prompts/prompt-user");
// RSA Key Generation Command
exports.rsaKeygenCommand = new commander_1.Command("rsa-keygen")
    .description("Generate RSA key pair")
    .option("-s, --size <bits>", "Key size in bits (2048, 3072, 4096)", "2048")
    .option("-o, --out <dir>", "Output directory (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function ({ size, out, yes }) {
    const keySize = parseInt(size);
    if (![2048, 3072, 4096].includes(keySize)) {
        console.error(chalk_1.default.red("✗ Invalid key size"));
        console.log(chalk_1.default.gray("  Supported: 2048, 3072, 4096"));
        process.exit(1);
    }
    console.log(chalk_1.default.blue("🔐 Generating RSA key pair..."));
    // Generate key pair
    const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
    if (yes) {
        // Output to stdout
        console.log("=== PUBLIC KEY ===");
        console.log(publicKey);
        console.log("\n=== PRIVATE KEY ===");
        console.log(privateKey);
    }
    else {
        // Determine output directory
        let outputDir;
        if (out) {
            outputDir = out;
        }
        else {
            const defaultDir = "./keys";
            outputDir = await (0, prompt_user_1.getSaveLocation)(defaultDir);
        }
        if (outputDir) {
            const dir = path_1.default.resolve(outputDir);
            fs_1.default.mkdirSync(dir, { recursive: true });
            const publicKeyPath = path_1.default.join(dir, "public_key.pem");
            const privateKeyPath = path_1.default.join(dir, "private_key.pem");
            fs_1.default.writeFileSync(publicKeyPath, publicKey, "utf8");
            fs_1.default.writeFileSync(privateKeyPath, privateKey, "utf8");
            console.log(chalk_1.default.green("\n✓") + " RSA key pair generated");
            console.log(chalk_1.default.gray("  Directory:") + ` ${dir}`);
            console.log(chalk_1.default.gray("  Public key:") + ` public_key.pem`);
            console.log(chalk_1.default.gray("  Private key:") + ` private_key.pem`);
            console.log(chalk_1.default.gray("  Key size:") + ` ${keySize} bits`);
            console.log(chalk_1.default.yellow("\n  ⚠ Keep your private key secure!"));
        }
        else {
            console.log(chalk_1.default.green("\n✓") + " RSA key pair generated");
            console.log(chalk_1.default.gray("  Public key:") + ` public_key.pem`);
            console.log(chalk_1.default.gray("  Private key:") + ` private_key.pem`);
            console.log(chalk_1.default.gray("  Key size:") + ` ${keySize} bits`);
            console.log(chalk_1.default.yellow("\n  ⚠ Keep your private key secure!"));
        }
    }
});
