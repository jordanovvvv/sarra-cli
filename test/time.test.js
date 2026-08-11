const assert = require("node:assert/strict");
const test = require("node:test");
const { runCli } = require("./helpers/run-cli");

test("time diff defaults the second timestamp to now", () => {
  const result = runCli([
    "time",
    "diff",
    "2026-01-20T10:00:00Z",
    "--unit",
    "hours",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout.trim(), /^-?\d+$/);
});

test("time diff accepts Unix timestamps in seconds", () => {
  const result = runCli([
    "time",
    "diff",
    "1737468322",
    "1737554722",
    "--unit",
    "seconds",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "86400");
});

test("time add accepts Unix timestamps in seconds", () => {
  const result = runCli([
    "time",
    "add",
    "1737468322",
    "--days",
    "1",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    new Date((1737468322 + 86400) * 1000).toISOString(),
  );
});
