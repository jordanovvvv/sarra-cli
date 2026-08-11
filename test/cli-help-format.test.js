const assert = require("node:assert/strict");
const test = require("node:test");
const { runCli } = require("./helpers/run-cli");

test("main help contains only registered example command paths", () => {
  const result = runCli(["--help"]);

  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout, /data json-pretty/);
  assert.doesNotMatch(result.stdout, /crypto ssl generate/);
  assert.match(result.stdout, /data json format file\.json/);
  assert.match(result.stdout, /ssl generate --domain example\.com/);
});

test("crypto accepts its documented JSON format option", () => {
  const result = runCli([
    "crypto",
    "--format",
    "json",
    "hash",
    "sha256",
    "data",
    "-y",
  ]);

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.algorithm, "sha256");
  assert.equal(output.input, "data");
});

test("geo accepts its documented JSON format option", () => {
  const result = runCli([
    "geo",
    "--format",
    "json",
    "validate",
    "192.168.1.1",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    ip: "192.168.1.1",
    valid: true,
    type: "IPv4",
  });
});

test("time and SSL group help include their detailed guides", () => {
  const timeHelp = runCli(["time", "--help"]);
  const sslHelp = runCli(["ssl", "--help"]);

  assert.equal(timeHelp.status, 0);
  assert.match(timeHelp.stdout, /TIMESTAMP FORMATS/);
  assert.equal(sslHelp.status, 0);
  assert.match(sslHelp.stdout, /Sarra CLI: SSL Utility Guide/);
});
