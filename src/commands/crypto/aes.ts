import { Command } from "commander";
import { readStdin } from "../../utils/stdin";
import chalk from "chalk";
import crypto from "crypto";
import { getSaveLocation } from "../../prompts/prompt-user";
import path from "path";
import fs from "fs";

// AES Encryption Command
export const aesEncryptCommand = new Command("aes-encrypt")
  .description("Encrypt data using AES-256-GCM")
  .argument("[input]", "Input string to encrypt (reads from stdin if omitted)")
  .option(
    "-k, --key <key>",
    "Encryption key (hex, 32 bytes). Auto-generated if omitted",
  )
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function (input, { key, out, yes }) {
    const parentOpts = this.parent?.opts() as { format?: string };
    const format = parentOpts?.format ?? "text";

    // Get input data
    const data = input ?? (await readStdin());

    if (!data) {
      console.error(chalk.red("✗ No input provided"));
      console.log(chalk.gray("  Provide input as argument or via stdin"));
      process.exit(1);
    }

    // Generate or validate key
    let encryptionKey: Buffer;
    if (key) {
      try {
        encryptionKey = Buffer.from(key, "hex");
        if (encryptionKey.length !== 32) {
          throw new Error("Key must be 32 bytes (64 hex characters)");
        }
      } catch (err) {
        console.error(chalk.red("✗ Invalid encryption key"));
        console.log(chalk.gray("  Key must be 64 hex characters (32 bytes)"));
        process.exit(1);
      }
    } else {
      encryptionKey = crypto.randomBytes(32);
    }

    // Generate IV
    const iv = crypto.randomBytes(16);

    // Encrypt
    const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    // Format output
    let output: string;

    switch (format) {
      case "json":
        output = JSON.stringify(
          {
            algorithm: "aes-256-gcm",
            encrypted,
            iv: iv.toString("hex"),
            authTag: authTag.toString("hex"),
            key: encryptionKey.toString("hex"),
          },
          null,
          2,
        );
        break;
      case "text":
      default:
        output = `Encrypted: ${encrypted}\nIV: ${iv.toString("hex")}\nAuth Tag: ${authTag.toString("hex")}\nKey: ${encryptionKey.toString("hex")}`;
        break;
    }

    // Determine output method
    let outputPath: string | null;

    if (out) {
      outputPath = out;
    } else if (yes) {
      outputPath = null;
    } else {
      const defaultFilename =
        format === "json" ? "encrypted.json" : "encrypted.txt";
      outputPath = await getSaveLocation(defaultFilename);
    }

    if (outputPath) {
      const filePath = path.resolve(outputPath);
      const dir = path.dirname(filePath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, output + "\n", "utf8");

      console.log(chalk.green("\n✓") + " Data encrypted and saved");
      console.log(chalk.gray("  File:") + ` ${filePath}`);
      console.log(chalk.gray("  Algorithm:") + " aes-256-gcm");
      console.log(chalk.yellow("  ⚠ Save the key securely to decrypt later!"));
    } else {
      console.log(output);
    }
  });

// AES Decryption Command
export const aesDecryptCommand = new Command("aes-decrypt")
  .description("Decrypt data using AES-256-GCM")
  .argument("[input]", "Encrypted data (hex) (reads from stdin if omitted)")
  .requiredOption("-k, --key <key>", "Decryption key (hex, 32 bytes)")
  .requiredOption("-i, --iv <iv>", "Initialization vector (hex, 16 bytes)")
  .requiredOption("-t, --tag <tag>", "Auth tag (hex, 16 bytes)")
  .option("-o, --out <file>", "Write output to a file (skips prompt)")
  .option("-y, --yes", "Skip prompt and output to stdout", false)
  .action(async function (input, { key, iv, tag, out, yes }) {
    // Get input data
    const encryptedData = input ?? (await readStdin());

    if (!encryptedData) {
      console.error(chalk.red("✗ No encrypted data provided"));
      process.exit(1);
    }

    try {
      // Parse inputs
      const decryptionKey = Buffer.from(key, "hex");
      const ivBuffer = Buffer.from(iv, "hex");
      const authTag = Buffer.from(tag, "hex");

      // Decrypt
      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        decryptionKey,
        ivBuffer,
      );
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedData.trim(), "hex", "utf8");
      decrypted += decipher.final("utf8");

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
        fs.writeFileSync(filePath, decrypted, "utf8");

        console.log(chalk.green("\n✓") + " Data decrypted and saved");
        console.log(chalk.gray("  File:") + ` ${filePath}`);
      } else {
        console.log(decrypted);
      }
    } catch (err) {
      console.error(chalk.red("✗ Decryption failed"));
      console.log(chalk.gray("  Check that key, IV, and auth tag are correct"));
      process.exit(1);
    }
  });
