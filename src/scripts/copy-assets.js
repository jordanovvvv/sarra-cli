const fs = require("fs");
const path = require("path");

// copy help instructions for 'id' command
const fromId = path.resolve("src/commands/id/help.md");
const toId = path.resolve("dist/commands/id/help.md");
fs.mkdirSync(path.dirname(toId), { recursive: true });
fs.copyFileSync(fromId, toId);

// copy help instructions for 'crypto' command
const fromCrypto = path.resolve("src/commands/crypto/help.md");
const toCrypto = path.resolve("dist/commands/crypto/help.md");
fs.mkdirSync(path.dirname(toCrypto), { recursive: true });
fs.copyFileSync(fromCrypto, toCrypto);

// copy help instructions for 'data' command
const fromData = path.resolve("src/commands/data/help.md");
const toData = path.resolve("dist/commands/data/help.md");
fs.mkdirSync(path.dirname(toData), { recursive: true });
fs.copyFileSync(fromData, toData);

// copy help instructions for 'time' command
const fromTime = path.resolve("src/commands/time/help.md");
const toTime = path.resolve("dist/commands/time/help.md");
fs.mkdirSync(path.dirname(toTime), { recursive: true });
fs.copyFileSync(fromTime, toTime);
