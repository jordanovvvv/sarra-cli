const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runCli } = require("./helpers/run-cli");

test("QR group help loads the detailed documentation", () => {
  const result = runCli(["qr", "--help"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Output management/i);
});

test("QR generation creates nested output directories", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sarra-qr-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const output = path.join(tempDir, "nested", "codes", "code.png");

  const result = runCli(["qr", "generate", "Data", "-o", output]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(output), true);
});

test("QR terminal output supports opting out of compact rendering", () => {
  const result = runCli(["qr", "terminal", "Data", "--no-small"]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Encoded: "Data"/);
});
