#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const id_1 = require("./commands/id");
const crypto_1 = require("./commands/crypto");
const data_1 = require("./commands/data");
const time_1 = require("./commands/time");
const chalk_1 = __importDefault(require("chalk"));
const generator_1 = require("./commands/qrcodes/generator");
const program = new commander_1.Command();
program
    .name("sarra")
    .description("Daily developer ability enhancement tools")
    .version("0.1.1")
    .showHelpAfterError()
    .helpOption("-h, --help", "Display help for command");
// pretify main help output
program.addHelpText("after", `
${chalk_1.default.bold.cyan("COMMAND GROUPS")}

  ${chalk_1.default.green("id")}        Identifiers, tokens, UUIDs
  ${chalk_1.default.green("crypto")}    Cryptography utilities
  ${chalk_1.default.green("data")}      Data encoding and formatting
  ${chalk_1.default.green("time")}      Date and time utilities
  ${chalk_1.default.green("qr")}        QR code generation

${chalk_1.default.bold.cyan("EXAMPLES")}

  ${chalk_1.default.green("sarra id uuid")}
  ${chalk_1.default.green("sarra id random --length 32")}
  ${chalk_1.default.green("sarra time now")}
  ${chalk_1.default.green("sarra data json-pretty file.json")}
  ${chalk_1.default.green("sarra crypto hash 'my secret'")}
  ${chalk_1.default.green("sarra qr generate 'Hello World'")}

${chalk_1.default.bold.cyan("TIPS")}

  • Use ${chalk_1.default.yellow("--help")} on any command for more details
  • Use ${chalk_1.default.yellow("--version")} to see the current version
  • Global options must appear before subcommands
`);
program.addCommand(id_1.idCommands);
program.addCommand(crypto_1.cryptoCommands);
program.addCommand(data_1.dataCommands);
program.addCommand(time_1.timeCommands);
program.addCommand(generator_1.qrCommands);
program.parse();
