import { Command } from "commander";
import fs from "fs";
import path from "path";
import { hashCommand } from "./hash";
import { base64Command } from "./base64";
import { prettyHelp } from "../../help/prettyHelp";
import { aesDecryptCommand, aesEncryptCommand } from "./aes";
import { rsaDecryptCommand, rsaEncryptCommand, rsaKeygenCommand } from "./rsa";

const helpPath = path.resolve(__dirname, "../../docs/crypto-help.md");

let helpText = "";
try {
  helpText = fs.readFileSync(helpPath, "utf8");
} catch {
  helpText = "";
}

export const cryptoCommands = new Command("crypto")
  .description("Cryptographic utilities")
  .addHelpText("after", `\n${prettyHelp(helpText)}`)
  .action(function () {
    this.outputHelp();
  })
  .addCommand(hashCommand) // md5 | sha1 | sha256 | sha512
  .addCommand(base64Command) // base64 encode/decode
  .addCommand(aesEncryptCommand) // AES Encryption Command
  .addCommand(aesDecryptCommand) // AES Decryption Command
  .addCommand(rsaKeygenCommand) // RSA Key Generation Command
  .addCommand(rsaEncryptCommand) // RSA Encrypt Command
  .addCommand(rsaDecryptCommand); // RSA Decrypt Command
