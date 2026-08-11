const assert = require("node:assert/strict");
const test = require("node:test");
const { runCli } = require("./helpers/run-cli");

test("stdin hash writes its result directly to stdout", () => {
  const result = runCli(["crypto", "hash", "sha256"], { input: "hello\n" });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  );
});

test("crypto commands compose through stdin without output flags", () => {
  const encoded = runCli(["crypto", "base64"], { input: "hello\n" });
  assert.equal(encoded.status, 0, encoded.stderr);
  assert.equal(encoded.stdout.trim(), "aGVsbG8=");

  const hashed = runCli(["crypto", "hash", "sha256"], {
    input: encoded.stdout,
  });
  assert.equal(hashed.status, 0, hashed.stderr);
  assert.doesNotMatch(hashed.stdout, /Save Location/);
});

test("data commands compose through stdin without output flags", () => {
  const formatted = runCli(["data", "json", "format"], {
    input: '{"a":1,"b":2}\n',
  });
  assert.equal(formatted.status, 0, formatted.stderr);
  assert.match(formatted.stdout, /"a": 1/);

  const minified = runCli(["data", "json", "minify"], {
    input: formatted.stdout,
  });
  assert.equal(minified.status, 0, minified.stderr);
  assert.equal(minified.stdout.trim(), '{"a":1,"b":2}');
});
