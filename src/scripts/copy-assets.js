const fs = require("fs");
const path = require("path");

const DOCS = [
  "id-help.md",
  "crypto-help.md",
  "data-help.md",
  "qrcode-help.md",
  "ssl-help.md",
  "time-help.md",
  "geo-help.md",
];

for (const file of DOCS) {
  const from = path.resolve("docs", file);
  const to = path.resolve("dist", "docs", file);

  if (!fs.existsSync(from)) {
    console.warn(`⚠️ Missing doc: ${from}`);
    continue;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);

  console.log(`✔ Copied ${file}`);
}
console.log("✅ All docs copied successfully.");
