const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { projectRoot } = require("./helpers/run-cli");

const documentationFiles = [
  path.join(projectRoot, "README.md"),
  ...fs
    .readdirSync(path.join(projectRoot, "docs"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(projectRoot, "docs", file)),
];

test("all relative Markdown links point to existing files", () => {
  const missing = [];

  for (const file of documentationFiles) {
    const markdown = fs.readFileSync(file, "utf8");
    const links = markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);

    for (const [, target] of links) {
      if (!target.startsWith(".")) continue;

      const relativePath = target.split("#", 1)[0];
      const resolvedPath = path.resolve(path.dirname(file), relativePath);
      if (!fs.existsSync(resolvedPath)) {
        missing.push(`${path.relative(projectRoot, file)} -> ${target}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("documentation no longer advertises the confirmed invalid commands", () => {
  const documentation = documentationFiles
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");

  assert.doesNotMatch(documentation, /docs\/qr-help\.md/);
  assert.doesNotMatch(documentation, /sarra data json-pretty/);
  assert.doesNotMatch(documentation, /sarra crypto ssl generate/);
  assert.doesNotMatch(documentation, /sarra geo my-ip -y/);
  assert.doesNotMatch(documentation, /Interactive prompt \(default/);
  assert.doesNotMatch(documentation, /By default, commands will prompt/);
});

test("documentation covers the corrected QR, pipeline, and SSL behavior", () => {
  const readme = fs.readFileSync(path.join(projectRoot, "README.md"), "utf8");
  const qrDocs = fs.readFileSync(
    path.join(projectRoot, "docs", "qrcode-help.md"),
    "utf8",
  );
  const sslDocs = fs.readFileSync(
    path.join(projectRoot, "docs", "ssl-help.md"),
    "utf8",
  );

  assert.match(readme, /Commands print to stdout by default/);
  assert.match(readme, /--save/);
  assert.match(qrDocs, /--no-small/);
  assert.match(sslDocs, /generates three files/);
  assert.match(sslDocs, /\.\/certs/);
});
