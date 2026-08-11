const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runCli } = require("./helpers/run-cli");

test("SSL generation prompts for and honors an output directory", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sarra-ssl-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const result = runCli(
    [
      "ssl",
      "generate",
      "--domain",
      "test.local",
      "--validity",
      "1",
      "--save",
    ],
    { cwd: tempDir, input: "\n", timeout: 30_000 },
  );
  const outputDirectory = path.join(tempDir, "certs");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Default directory: \.\/certs/);
  assert.equal(fs.existsSync(path.join(outputDirectory, "test.local.crt")), true);
  assert.equal(fs.existsSync(path.join(outputDirectory, "test.local.key")), true);
  assert.equal(fs.existsSync(path.join(outputDirectory, "README.md")), true);
});

test("SSL generation honors a custom output directory", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sarra-ssl-custom-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const customDirectory = path.join(tempDir, "custom-certs");

  const result = runCli(
    [
      "ssl",
      "generate",
      "--domain",
      "custom.local",
      "--validity",
      "1",
      "--save",
    ],
    { cwd: tempDir, input: `${customDirectory}\n`, timeout: 30_000 },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(customDirectory, "custom.local.crt")), true);
  assert.equal(fs.existsSync(path.join(customDirectory, "custom.local.key")), true);
  assert.equal(fs.existsSync(path.join(customDirectory, "README.md")), true);
});
