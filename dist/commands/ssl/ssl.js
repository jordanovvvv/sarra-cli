"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslCommands = void 0;
const commander_1 = require("commander");
const node_forge_1 = __importDefault(require("node-forge"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const prompt_user_1 = require("../../prompts/prompt-user");
const util_1 = require("util");
const child_process_1 = require("child_process");
const generate_ssl_readme_1 = require("./generate-ssl-readme");
const path_1 = __importDefault(require("path"));
const prettyHelp_1 = require("../../help/prettyHelp");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const helpPath = path_1.default.resolve(__dirname, "../../docs/ssl-help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch {
    helpText = "";
}
exports.sslCommands = new commander_1.Command("ssl");
exports.sslCommands
    .command("generate")
    .description("Generate a SSL certificate")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .option("-d, --domain <domain>", "Domain name", "localhost")
    .option("--val, --validity <days>", "Validity period (max 365)", (val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) || parsed < 1 ? 365 : Math.min(parsed, 365);
}, 365)
    .action(async (options) => {
    const { domain, validity } = options;
    // 1. Determine Save Path interactively
    const defaultFileName = `${domain}.crt`;
    const targetPath = await (0, prompt_user_1.getSaveLocation)(defaultFileName);
    if (!targetPath) {
        console.log(chalk_1.default.yellow("Operation cancelled by user."));
        return;
    }
    // Determine directory and filenames
    const outDir = targetPath.endsWith(".crt") || targetPath.endsWith(".key")
        ? "./certs"
        : targetPath;
    console.log(chalk_1.default.blue(`\nGenerating cert for ${domain} (${validity} days)...`));
    // 2. Generate Key Pair & Cert (Node-Forge logic)
    const keys = node_forge_1.default.pki.rsa.generateKeyPair(2048);
    const cert = node_forge_1.default.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01" + Math.floor(Math.random() * 1000000);
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + validity);
    const attrs = [{ name: "commonName", value: domain }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
        { name: "basicConstraints", cA: false },
        { name: "keyUsage", digitalSignature: true, keyEncipherment: true },
        { name: "subjectAltName", altNames: [{ type: 2, value: domain }] },
    ]);
    cert.sign(keys.privateKey, node_forge_1.default.md.sha256.create());
    // 3. Final Write
    if (!fs_1.default.existsSync(outDir))
        fs_1.default.mkdirSync(outDir, { recursive: true });
    const pemKey = node_forge_1.default.pki.privateKeyToPem(keys.privateKey);
    const pemCert = node_forge_1.default.pki.certificateToPem(cert);
    fs_1.default.writeFileSync(`${outDir}/${domain}.key`, pemKey);
    fs_1.default.writeFileSync(`${outDir}/${domain}.crt`, pemCert);
    // 4. Write README.md to output directory
    try {
        fs_1.default.writeFileSync(`${outDir}/README.md`, generate_ssl_readme_1.readmeTemplate);
        console.log(chalk_1.default.gray("📄 Created README.md with usage instructions"));
    }
    catch (error) {
        console.log(chalk_1.default.dim("ℹ️  README.md not created"));
    }
    console.log(chalk_1.default.green(`\n✅ Success!`));
    console.log(`${chalk_1.default.gray("Location:")} ${outDir}`);
    console.log(chalk_1.default.gray(`Files generated:`));
    console.log(chalk_1.default.white(`  • ${domain}.crt (certificate)`));
    console.log(chalk_1.default.white(`  • ${domain}.key (private key)`));
    console.log(chalk_1.default.white(`  • README.md (instructions)`));
});
// New Let's Encrypt command
exports.sslCommands
    .command("letsencrypt")
    .description("Get a trusted SSL certificate from Let's Encrypt")
    .option("-d, --domain <domain>", "Your domain name (e.g., example.com)")
    .option("-e, --email <email>", "Your email address for renewal notifications")
    .option("--staging", "Use Let's Encrypt staging environment (for testing)")
    .option("--webroot <path>", "Webroot path for HTTP challenge")
    .option("--standalone", "Use standalone mode (requires port 80 to be free)")
    .action(async (options) => {
    console.log(chalk_1.default.bold.cyan("\n🔒 Let's Encrypt Certificate Setup\n"));
    // Check if certbot is installed
    const certbotInstalled = await checkCertbot();
    if (!certbotInstalled) {
        console.log(chalk_1.default.yellow("⚠️  Certbot is not installed.\n"));
        console.log(chalk_1.default.gray("Certbot is the official Let's Encrypt client.\n"));
        console.log(chalk_1.default.bold("Installation instructions:\n"));
        console.log(chalk_1.default.gray("macOS:       ") + chalk_1.default.green("brew install certbot"));
        console.log(chalk_1.default.gray("Ubuntu:      ") + chalk_1.default.green("sudo apt install certbot"));
        console.log(chalk_1.default.gray("Windows:     ") +
            chalk_1.default.green("Download from https://certbot.eff.org"));
        console.log(chalk_1.default.gray("\nAfter installing, run this command again."));
        return;
    }
    // Validate required options
    if (!options.domain) {
        console.log(chalk_1.default.red("❌ Domain is required"));
        console.log(chalk_1.default.gray("Usage: sarra ssl letsencrypt --domain example.com --email you@example.com"));
        return;
    }
    if (!options.email) {
        console.log(chalk_1.default.red("❌ Email is required for Let's Encrypt notifications"));
        console.log(chalk_1.default.gray("Usage: sarra ssl letsencrypt --domain example.com --email you@example.com"));
        return;
    }
    // Validate domain format
    if (options.domain === "localhost" || options.domain.endsWith(".local")) {
        console.log(chalk_1.default.red("❌ Let's Encrypt doesn't work with localhost or .local domains"));
        console.log(chalk_1.default.gray("Use 'sarra ssl generate' for local development instead."));
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
        console.log(chalk_1.default.yellow("🧪 Using staging environment (test mode)\n"));
    }
    if (options.standalone) {
        certbotArgs.push("--standalone");
        console.log(chalk_1.default.blue("📡 Using standalone mode (port 80 must be free)\n"));
    }
    else if (options.webroot) {
        certbotArgs.push("--webroot", "-w", options.webroot);
        console.log(chalk_1.default.blue(`📁 Using webroot: ${options.webroot}\n`));
    }
    else {
        console.log(chalk_1.default.yellow("⚠️  No challenge method specified."));
        console.log(chalk_1.default.gray("Add --standalone OR --webroot <path>\n"));
        console.log(chalk_1.default.bold("Examples:"));
        console.log(chalk_1.default.green("  sarra ssl letsencrypt -d example.com -e you@example.com --standalone"));
        console.log(chalk_1.default.green("  sarra ssl letsencrypt -d example.com -e you@example.com --webroot /var/www/html"));
        return;
    }
    console.log(chalk_1.default.gray("Running certbot...\n"));
    console.log(chalk_1.default.dim(`Command: certbot ${certbotArgs.join(" ")}\n`));
    try {
        // Run certbot
        const certbot = (0, child_process_1.spawn)("certbot", certbotArgs, {
            stdio: "inherit",
            shell: true,
        });
        certbot.on("close", (code) => {
            if (code === 0) {
                console.log(chalk_1.default.green("\n✅ Certificate obtained successfully!"));
                console.log(chalk_1.default.gray("\nCertificate location:"));
                console.log(chalk_1.default.white(`  /etc/letsencrypt/live/${options.domain}/fullchain.pem`));
                console.log(chalk_1.default.white(`  /etc/letsencrypt/live/${options.domain}/privkey.pem`));
                console.log(chalk_1.default.gray("\nRenewal:"));
                console.log(chalk_1.default.dim("  Certificates auto-renew via certbot timer"));
                console.log(chalk_1.default.dim("  Test renewal: certbot renew --dry-run"));
            }
            else {
                console.log(chalk_1.default.red(`\n❌ Certbot failed with exit code ${code}`));
                console.log(chalk_1.default.gray("\nCommon issues:"));
                console.log(chalk_1.default.yellow("  • Domain must point to this server's IP"));
                console.log(chalk_1.default.yellow("  • Port 80 must be accessible from internet"));
                console.log(chalk_1.default.yellow("  • Firewall must allow incoming connections"));
                console.log(chalk_1.default.yellow("  • Check DNS with: dig +short example.com"));
            }
        });
    }
    catch (error) {
        console.log(chalk_1.default.red("❌ Error running certbot:"));
        console.log(error);
    }
});
// Helper function to check if certbot is installed
async function checkCertbot() {
    try {
        await execAsync("certbot --version");
        return true;
    }
    catch {
        return false;
    }
}
