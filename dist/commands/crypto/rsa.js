"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsaDecryptCommand = exports.rsaEncryptCommand = exports.rsaKeygenCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prompt_user_1 = require("../../prompts/prompt-user");
const stdin_1 = require("../../utils/stdin");
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
            console.log(chalk_1.default.red("\n✓") + " RSA key pair generation aborted!");
        }
    }
});
// RSA Encrypt Command
exports.rsaEncryptCommand = new commander_1.Command("rsa-encrypt")
    .description("Encrypt data using RSA public key")
    .argument("[input]", "Input string to encrypt (reads from stdin if omitted)")
    .requiredOption("-p, --public-key <file>", "Path to public key file (PEM)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function (input, { publicKey, out, yes }) {
    // Get input data
    const data = input ?? (await (0, stdin_1.readStdin)());
    if (!data) {
        console.error(chalk_1.default.red("✗ No input provided"));
        process.exit(1);
    }
    // Read public key
    const publicKeyPath = path_1.default.resolve(publicKey);
    if (!fs_1.default.existsSync(publicKeyPath)) {
        console.error(chalk_1.default.red("✗ Public key file not found"));
        process.exit(1);
    }
    const publicKeyPem = fs_1.default.readFileSync(publicKeyPath, "utf8");
    // Encrypt
    const encrypted = crypto_1.default.publicEncrypt({
        key: publicKeyPem,
        padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
    }, Buffer.from(data));
    const output = encrypted.toString("base64");
    // Determine output method
    let outputPath;
    if (out) {
        outputPath = out;
    }
    else if (yes) {
        outputPath = null;
    }
    else {
        outputPath = await (0, prompt_user_1.getSaveLocation)("encrypted.txt");
    }
    if (outputPath) {
        const filePath = path_1.default.resolve(outputPath);
        const dir = path_1.default.dirname(filePath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(filePath, output, "utf8");
        console.log(chalk_1.default.green("\n✓") + " Data encrypted with RSA");
        console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
    }
    else {
        console.log(output);
    }
});
// RSA Decrypt Command
exports.rsaDecryptCommand = new commander_1.Command("rsa-decrypt")
    .description("Decrypt data using RSA private key")
    .argument("[input]", "Encrypted data (base64) (reads from stdin if omitted)")
    .requiredOption("-k, --private-key <file>", "Path to private key file (PEM)")
    .option("-o, --out <file>", "Write output to a file (skips prompt)")
    .option("-y, --yes", "Skip prompt and output to stdout", false)
    .action(async function (input, { privateKey, out, yes }) {
    // Get input data
    const encryptedData = input ?? (await (0, stdin_1.readStdin)());
    if (!encryptedData) {
        console.error(chalk_1.default.red("✗ No encrypted data provided"));
        process.exit(1);
    }
    // Read private key
    const privateKeyPath = path_1.default.resolve(privateKey);
    if (!fs_1.default.existsSync(privateKeyPath)) {
        console.error(chalk_1.default.red("✗ Private key file not found"));
        process.exit(1);
    }
    const privateKeyPem = fs_1.default.readFileSync(privateKeyPath, "utf8");
    try {
        // Decrypt
        const decrypted = crypto_1.default.privateDecrypt({
            key: privateKeyPem,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(encryptedData.trim(), "base64"));
        const output = decrypted.toString("utf8");
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
            fs_1.default.writeFileSync(filePath, output, "utf8");
            console.log(chalk_1.default.green("\n✓") + " Data decrypted with RSA");
            console.log(chalk_1.default.gray("  File:") + ` ${filePath}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(chalk_1.default.red("✗ Decryption failed"));
        console.log(chalk_1.default.gray("  Check that the private key is correct"));
        process.exit(1);
    }
});
