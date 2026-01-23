#!/usr/bin/env node

import { Command } from "commander";

import { idCommands } from "./commands/id";
import { cryptoCommands } from "./commands/crypto";
import { dataCommands } from "./commands/data";
import chalk from "chalk";
import { qrCommands } from "./commands/qrcodes/generator";
import { timeCommands } from "./commands/time/time";
import { sslCommands } from "./commands/ssl/ssl";
import { geoCommands } from "./commands/geo";

const program = new Command();

program
  .name("sarra")
  .description("Daily developer ability enhancement tools")
  .version("0.3.6", "-v, --version", "Display the current version")
  .showHelpAfterError()
  .helpOption("-h, --help", "Display help for command");

// pretify main help output
program.addHelpText(
  "after",
  `
${chalk.bold.cyan("COMMAND GROUPS")}

  ${chalk.green("id")}        Identifiers, tokens, UUIDs
  ${chalk.green("crypto")}    Cryptography utilities
  ${chalk.green("data")}      Data encoding and formatting
  ${chalk.green("time")}      Date and time utilities
  ${chalk.green("qr")}        QR code generation
  ${chalk.green("ssl")}       SSL certificate generation
  ${chalk.green("geo")}      Geographical and IP utilities

${chalk.bold.cyan("EXAMPLES")}

  ${chalk.green("sarra id uuid")}
  ${chalk.green("sarra id random --length 32")}
  ${chalk.green("sarra time now")}
  ${chalk.green("sarra data json-pretty file.json")}
  ${chalk.green("sarra crypto hash sha256 'my secret'")}
  ${chalk.green("sarra crypto aes-encrypt 'secret message'")}
  ${chalk.green("sarra crypto aes-decrypt <data> -k <key> -i <iv> -t <tag>")}
  ${chalk.green("sarra crypto rsa-keygen --size 4096")}
  ${chalk.green("sarra crypto rsa-encrypt 'message' -p public_key.pem")}
  ${chalk.green("sarra crypto rsa-decrypt <data> -k private_key.pem")}
  ${chalk.green("sarra qr generate 'Hello World'")}
  ${chalk.green("sarra crypto ssl generate --domain example.com --validity 90")}
  ${chalk.green("sarra crypto ssl generate --domain myapp.local")}
  ${chalk.green("sarra geo my-ip --ipv4")}
  ${chalk.green("sarra geo lookup <ip-address>")}

${chalk.bold.cyan("TIPS")}

  • Use ${chalk.yellow("--help")} on any command for more details
  • Use ${chalk.yellow("--version")} to see the current version
  • Global options must appear before subcommands
`,
);

program.addCommand(idCommands);
program.addCommand(cryptoCommands);
program.addCommand(dataCommands);
program.addCommand(timeCommands);
program.addCommand(qrCommands);
program.addCommand(sslCommands);
program.addCommand(geoCommands);
program.parse();
