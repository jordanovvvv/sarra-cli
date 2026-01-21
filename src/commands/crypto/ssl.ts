import { Command } from "commander";
import forge from "node-forge";
import fs from "fs";
import chalk from "chalk";
import { getSaveLocation } from "../../prompts/prompt-user";
import { promisify } from "util";
import { exec, spawn } from "child_process";
import { readmeTemplate } from "./generate-ssl-readme";

const execAsync = promisify(exec);

export const sslCommands = new Command("ssl");

sslCommands
  .command("generate")
  .description("Generate a self-signed SSL certificate")
  .option("-d, --domain <domain>", "Domain name", "localhost")
  .option(
    "--val, --validity <days>",
    "Validity period (max 365)",
    (val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed < 1 ? 365 : Math.min(parsed, 365);
    },
    365
  )
  .action(async (options) => {
    const { domain, validity } = options;

    // 1. Determine Save Path interactively
    const defaultFileName = `${domain}.crt`;
    const targetPath = await getSaveLocation(defaultFileName);

    if (!targetPath) {
      console.log(chalk.yellow("Operation cancelled by user."));
      return;
    }

    // Determine directory and filenames
    const outDir =
      targetPath.endsWith(".crt") || targetPath.endsWith(".key")
        ? "./certs"
        : targetPath;

    console.log(
      chalk.blue(`\nGenerating cert for ${domain} (${validity} days)...`)
    );

    // 2. Generate Key Pair & Cert (Node-Forge logic)
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01" + Math.floor(Math.random() * 1000000);
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(
      cert.validity.notBefore.getDate() + validity
    );

    const attrs = [{ name: "commonName", value: domain }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
      { name: "basicConstraints", cA: false },
      { name: "keyUsage", digitalSignature: true, keyEncipherment: true },
      { name: "subjectAltName", altNames: [{ type: 2, value: domain }] },
    ]);

    cert.sign(keys.privateKey, forge.md.sha256.create());

    // 3. Final Write
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
    const pemCert = forge.pki.certificateToPem(cert);

    fs.writeFileSync(`${outDir}/${domain}.key`, pemKey);
    fs.writeFileSync(`${outDir}/${domain}.crt`, pemCert);

    // 4. Write README.md to output directory
    try {
      fs.writeFileSync(`${outDir}/README.md`, readmeTemplate);
      console.log(chalk.gray("📄 Created README.md with usage instructions"));
    } catch (error) {
      console.log(chalk.dim("ℹ️  README.md not created"));
    }

    console.log(chalk.green(`\n✅ Success!`));
    console.log(`${chalk.gray("Location:")} ${outDir}`);
    console.log(chalk.gray(`Files generated:`));
    console.log(chalk.white(`  • ${domain}.crt (certificate)`));
    console.log(chalk.white(`  • ${domain}.key (private key)`));
    console.log(chalk.white(`  • README.md (instructions)`));
  });

// New Let's Encrypt command
sslCommands
  .command("letsencrypt")
  .description("Get a trusted SSL certificate from Let's Encrypt")
  .option("-d, --domain <domain>", "Your domain name (e.g., example.com)")
  .option("-e, --email <email>", "Your email address for renewal notifications")
  .option("--staging", "Use Let's Encrypt staging environment (for testing)")
  .option("--webroot <path>", "Webroot path for HTTP challenge")
  .option("--standalone", "Use standalone mode (requires port 80 to be free)")
  .action(async (options) => {
    console.log(chalk.bold.cyan("\n🔒 Let's Encrypt Certificate Setup\n"));

    // Check if certbot is installed
    const certbotInstalled = await checkCertbot();

    if (!certbotInstalled) {
      console.log(chalk.yellow("⚠️  Certbot is not installed.\n"));
      console.log(
        chalk.gray("Certbot is the official Let's Encrypt client.\n")
      );
      console.log(chalk.bold("Installation instructions:\n"));
      console.log(
        chalk.gray("macOS:       ") + chalk.green("brew install certbot")
      );
      console.log(
        chalk.gray("Ubuntu:      ") + chalk.green("sudo apt install certbot")
      );
      console.log(
        chalk.gray("Windows:     ") +
          chalk.green("Download from https://certbot.eff.org")
      );
      console.log(chalk.gray("\nAfter installing, run this command again."));
      return;
    }

    // Validate required options
    if (!options.domain) {
      console.log(chalk.red("❌ Domain is required"));
      console.log(
        chalk.gray(
          "Usage: sarra ssl letsencrypt --domain example.com --email you@example.com"
        )
      );
      return;
    }

    if (!options.email) {
      console.log(
        chalk.red("❌ Email is required for Let's Encrypt notifications")
      );
      console.log(
        chalk.gray(
          "Usage: sarra ssl letsencrypt --domain example.com --email you@example.com"
        )
      );
      return;
    }

    // Validate domain format
    if (options.domain === "localhost" || options.domain.endsWith(".local")) {
      console.log(
        chalk.red(
          "❌ Let's Encrypt doesn't work with localhost or .local domains"
        )
      );
      console.log(
        chalk.gray("Use 'sarra ssl generate' for local development instead.")
      );
      return;
    }

    // Build certbot command
    const certbotArgs = [
      "certonly",
      "--non-interactive",
      "--agree-tos",
      "-d",
      options.domain,
      "-m",
      options.email,
    ];

    if (options.staging) {
      certbotArgs.push("--staging");
      console.log(chalk.yellow("🧪 Using staging environment (test mode)\n"));
    }

    if (options.standalone) {
      certbotArgs.push("--standalone");
      console.log(
        chalk.blue("📡 Using standalone mode (port 80 must be free)\n")
      );
    } else if (options.webroot) {
      certbotArgs.push("--webroot", "-w", options.webroot);
      console.log(chalk.blue(`📁 Using webroot: ${options.webroot}\n`));
    } else {
      console.log(chalk.yellow("⚠️  No challenge method specified."));
      console.log(chalk.gray("Add --standalone OR --webroot <path>\n"));
      console.log(chalk.bold("Examples:"));
      console.log(
        chalk.green(
          "  sarra ssl letsencrypt -d example.com -e you@example.com --standalone"
        )
      );
      console.log(
        chalk.green(
          "  sarra ssl letsencrypt -d example.com -e you@example.com --webroot /var/www/html"
        )
      );
      return;
    }

    console.log(chalk.gray("Running certbot...\n"));
    console.log(chalk.dim(`Command: certbot ${certbotArgs.join(" ")}\n`));

    try {
      // Run certbot
      const certbot = spawn("certbot", certbotArgs, {
        stdio: "inherit",
        shell: true,
      });

      certbot.on("close", (code: any) => {
        if (code === 0) {
          console.log(chalk.green("\n✅ Certificate obtained successfully!"));
          console.log(chalk.gray("\nCertificate location:"));
          console.log(
            chalk.white(
              `  /etc/letsencrypt/live/${options.domain}/fullchain.pem`
            )
          );
          console.log(
            chalk.white(`  /etc/letsencrypt/live/${options.domain}/privkey.pem`)
          );
          console.log(chalk.gray("\nRenewal:"));
          console.log(chalk.dim("  Certificates auto-renew via certbot timer"));
          console.log(chalk.dim("  Test renewal: certbot renew --dry-run"));
        } else {
          console.log(chalk.red(`\n❌ Certbot failed with exit code ${code}`));
          console.log(chalk.gray("\nCommon issues:"));
          console.log(
            chalk.yellow("  • Domain must point to this server's IP")
          );
          console.log(
            chalk.yellow("  • Port 80 must be accessible from internet")
          );
          console.log(
            chalk.yellow("  • Firewall must allow incoming connections")
          );
          console.log(
            chalk.yellow("  • Check DNS with: dig +short example.com")
          );
        }
      });
    } catch (error) {
      console.log(chalk.red("❌ Error running certbot:"));
      console.log(error);
    }
  });

// Helper function to check if certbot is installed
async function checkCertbot(): Promise<boolean> {
  try {
    await execAsync("certbot --version");
    return true;
  } catch {
    return false;
  }
}
