const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runCli } = require("./helpers/run-cli");

test("identifier commands print to stdout by default", () => {
  const result = runCli(["id", "uuid"]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout.trim(), /^[0-9a-f-]{36}$/);
  assert.doesNotMatch(result.stdout, /Save Location/);
});

test("--save explicitly opens the save-location prompt", () => {
  const result = runCli(
    ["crypto", "hash", "sha256", "data", "--save"],
    { input: "n\n" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Save Location/);
  assert.match(
    result.stdout,
    /3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7/,
  );
});

test("QR generation previews in the terminal by default", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sarra-qr-default-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const result = runCli(["qr", "generate", "Data"], { cwd: tempDir });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Terminal Preview/);
  assert.equal(fs.existsSync(path.join(tempDir, "qrcode.png")), false);
});

test("SSL generation prints PEM output by default", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sarra-ssl-default-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const result = runCli(
    ["ssl", "generate", "--domain", "stdout.local", "--validity", "1"],
    { cwd: tempDir, timeout: 30_000 },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /=== CERTIFICATE ===/);
  assert.match(result.stdout, /BEGIN CERTIFICATE/);
  assert.match(result.stdout, /=== PRIVATE KEY ===/);
  assert.equal(fs.existsSync(path.join(tempDir, "certs")), false);
});
