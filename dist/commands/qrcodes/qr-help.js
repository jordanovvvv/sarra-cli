"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrHelpText = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.qrHelpText = `
${chalk_1.default.bold.cyan("EXAMPLES")}

  ${chalk_1.default.bold("Generate QR code:")}
  ${chalk_1.default.green("sarra qr generate 'Hello World'")}
  ${chalk_1.default.green("sarra qr gen 'https://example.com' -o site.png -s 500")}
  ${chalk_1.default.green("sarra qr generate 'My text' -e H -t")}

  ${chalk_1.default.bold("Terminal preview only (no file):")}
  ${chalk_1.default.green("sarra qr terminal 'Quick preview'")}
  ${chalk_1.default.green("sarra qr term 'Check this out' --small")}

  ${chalk_1.default.bold("URL QR codes:")}
  ${chalk_1.default.green("sarra qr url https://github.com")}
  ${chalk_1.default.green("sarra qr url https://example.com -o link.png -t")}

  ${chalk_1.default.bold("From file content:")}
  ${chalk_1.default.green("sarra qr file config.json")}
  ${chalk_1.default.green("sarra qr file data.txt -o data-qr.png -s 600 -t")}

  ${chalk_1.default.bold("Custom colors:")}
  ${chalk_1.default.green("sarra qr generate 'Styled' --dark '#FF0000' --light '#FFFF00'")}

${chalk_1.default.bold.cyan("ERROR CORRECTION LEVELS")}

  ${chalk_1.default.yellow("L")} - Low (7% recovery)
  ${chalk_1.default.yellow("M")} - Medium (15% recovery) ${chalk_1.default.gray("[default]")}
  ${chalk_1.default.yellow("Q")} - Quartile (25% recovery)
  ${chalk_1.default.yellow("H")} - High (30% recovery)

${chalk_1.default.bold.cyan("TERMINAL OUTPUT")}

  Use ${chalk_1.default.yellow("-t, --terminal")} on any command to display ASCII preview
  Use ${chalk_1.default.yellow("--small")} for compact terminal output
  Use ${chalk_1.default.yellow("sarra qr terminal")} for terminal-only output (no file)
`;
