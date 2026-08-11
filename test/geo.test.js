const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { projectRoot, runCli } = require("./helpers/run-cli");

test("Geo validation accepts compressed IPv6 addresses", () => {
  for (const address of ["::1", "2001:db8::1"]) {
    const result = runCli(["geo", "validate", address]);
    assert.equal(result.status, 0, `${address}: ${result.stderr}`);
    assert.match(result.stdout, /Valid IP address/);
    assert.match(result.stdout, /IPv6/);
  }
});

test("Geo validation still rejects malformed addresses", () => {
  const result = runCli(["geo", "validate", "999.999.999.999"]);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /Invalid IP address/);
});

test("Geo documentation does not advertise an unsupported my-ip flag", () => {
  const docs = fs.readFileSync(
    path.join(projectRoot, "docs", "geo-help.md"),
    "utf8",
  );

  assert.doesNotMatch(docs, /geo my-ip -y/);
});
