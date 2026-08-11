const { spawnSync } = require("node:child_process");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");
const cliPath = path.join(projectRoot, "dist", "cli.js");

function runCli(args, options = {}) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? projectRoot,
    input: options.input,
    encoding: "utf8",
    timeout: options.timeout ?? 10_000,
    env: {
      ...process.env,
      FORCE_COLOR: "0",
    },
  });

  if (result.error) {
    throw result.error;
  }

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

module.exports = { projectRoot, runCli };
