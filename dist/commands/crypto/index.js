"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoCommands = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const hash_1 = require("./hash");
const base64_1 = require("./base64");
const prettyHelp_1 = require("../../help/prettyHelp");
const aes_1 = require("./aes");
const rsa_1 = require("./rsa");
const helpPath = path_1.default.resolve(__dirname, "../../docs/crypto-help.md");
let helpText = "";
try {
    helpText = fs_1.default.readFileSync(helpPath, "utf8");
}
catch {
    helpText = "";
}
exports.cryptoCommands = new commander_1.Command("crypto")
    .description("Cryptographic utilities")
    .addHelpText("after", `\n${(0, prettyHelp_1.prettyHelp)(helpText)}`)
    .action(function () {
    this.outputHelp();
})
    .addCommand(hash_1.hashCommand) // md5 | sha1 | sha256 | sha512
    .addCommand(base64_1.base64Command) // base64 encode/decode
    .addCommand(aes_1.aesEncryptCommand) // AES Encryption Command
    .addCommand(aes_1.aesDecryptCommand) // AES Decryption Command
    .addCommand(rsa_1.rsaKeygenCommand) // RSA Key Generation Command
    .addCommand(rsa_1.rsaEncryptCommand) // RSA Encrypt Command
    .addCommand(rsa_1.rsaDecryptCommand); // RSA Decrypt Command
