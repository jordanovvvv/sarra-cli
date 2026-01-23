import chalk from "chalk";
import { Command } from "commander";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getSaveLocation } from "../../prompts/prompt-user";
import { readStdin } from "../../utils/stdin";

// RSA Key Generation Command
export const rsaKeygenCommand = new Command("rsa-keygen")
  .description("Generate RSA key pair")
  .option("-s, --size <bits>", "Key size in bits (2048, 3072, 4096)", "2048")
  .option("-o, --out <dir>", "Output directory (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function ({ size, out, yes }) {
    const keySize = parseInt(size);

    if (![2048, 3072, 4096].includes(keySize)) {
      console.error(chalk.red("✗ Invalid key size"));
      console.log(chalk.gray("  Supported: 2048, 3072, 4096"));
      process.exit(1);
    }

    console.log(chalk.blue("🔐 Generating RSA key pair..."));

    // Generate key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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
    } else {
      // Determine output directory
      let outputDir: string | null;

      if (out) {
        outputDir = out;
      } else {
        const defaultDir = "./keys";
        outputDir = await getSaveLocation(defaultDir);
      }

      if (outputDir) {
        const dir = path.resolve(outputDir);
        fs.mkdirSync(dir, { recursive: true });

        const publicKeyPath = path.join(dir, "public_key.pem");
        const privateKeyPath = path.join(dir, "private_key.pem");

        fs.writeFileSync(publicKeyPath, publicKey, "utf8");
        fs.writeFileSync(privateKeyPath, privateKey, "utf8");

        console.log(chalk.green("\n✓") + " RSA key pair generated");
        console.log(chalk.gray("  Directory:") + ` ${dir}`);
        console.log(chalk.gray("  Public key:") + ` public_key.pem`);
        console.log(chalk.gray("  Private key:") + ` private_key.pem`);
        console.log(chalk.gray("  Key size:") + ` ${keySize} bits`);
        console.log(chalk.yellow("\n  ⚠ Keep your private key secure!"));
      } else {
        console.log(chalk.red("\n✓") + " RSA key pair generation aborted!");
      }
    }
  });

// RSA Encrypt Command
export const rsaEncryptCommand = new Command("rsa-encrypt")
  .description("Encrypt data using RSA public key")
  .argument("[input]", "Input string to encrypt (reads from stdin if omitted)")
  .requiredOption("-p, --public-key <file>", "Path to public key file (PEM)")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function (input, { publicKey, out, yes }) {
    // Get input data
    const data = input ?? (await readStdin());

    if (!data) {
      console.error(chalk.red("✗ No input provided"));
      process.exit(1);
    }

    // Read public key
    const publicKeyPath = path.resolve(publicKey);
    if (!fs.existsSync(publicKeyPath)) {
      console.error(chalk.red("✗ Public key file not found"));
      process.exit(1);
    }

    const publicKeyPem = fs.readFileSync(publicKeyPath, "utf8");

    // Encrypt
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data),
    );

    const output = encrypted.toString("base64");

    // Determine output method
    let outputPath: string | null;

    if (out) {
      outputPath = out;
    } else if (yes) {
      outputPath = null;
    } else {
      outputPath = await getSaveLocation("encrypted.txt");
    }

    if (outputPath) {
      const filePath = path.resolve(outputPath);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output, "utf8");

      console.log(chalk.green("\n✓") + " Data encrypted with RSA");
      console.log(chalk.gray("  File:") + ` ${filePath}`);
    } else {
      console.log(output);
    }
  });

// RSA Decrypt Command
export const rsaDecryptCommand = new Command("rsa-decrypt")
  .description("Decrypt data using RSA private key")
  .argument("[input]", "Encrypted data (base64) (reads from stdin if omitted)")
  .requiredOption("-k, --private-key <file>", "Path to private key file (PEM)")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function (input, { privateKey, out, yes }) {
    // Get input data
    const encryptedData = input ?? (await readStdin());

    if (!encryptedData) {
      console.error(chalk.red("✗ No encrypted data provided"));
      process.exit(1);
    }

    // Read private key
    const privateKeyPath = path.resolve(privateKey);
    if (!fs.existsSync(privateKeyPath)) {
      console.error(chalk.red("✗ Private key file not found"));
      process.exit(1);
    }

    const privateKeyPem = fs.readFileSync(privateKeyPath, "utf8");

    try {
      // Decrypt
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKeyPem,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(encryptedData.trim(), "base64"),
      );

      const output = decrypted.toString("utf8");

      // Determine output method
      let outputPath: string | null;

      if (out) {
        outputPath = out;
      } else if (yes) {
        outputPath = null;
      } else {
        outputPath = await getSaveLocation("decrypted.txt");
      }

      if (outputPath) {
        const filePath = path.resolve(outputPath);
        const dir = path.dirname(filePath);

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, output, "utf8");

        console.log(chalk.green("\n✓") + " Data decrypted with RSA");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
      } else {
        console.log(output);
      }
    } catch (err) {
      console.error(chalk.red("✗ Decryption failed"));
      console.log(chalk.gray("  Check that the private key is correct"));
      process.exit(1);
    }
  });
