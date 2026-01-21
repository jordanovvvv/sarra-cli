import chalk from "chalk";

export const qrHelpText = `
${chalk.bold.cyan("EXAMPLES")}

  ${chalk.bold("Generate QR code:")}
  ${chalk.green("sarra qr generate 'Hello World'")}
  ${chalk.green("sarra qr gen 'https://example.com' -o site.png -s 500")}
  ${chalk.green("sarra qr generate 'My text' -e H -t")}

  ${chalk.bold("Terminal preview only (no file):")}
  ${chalk.green("sarra qr terminal 'Quick preview'")}
  ${chalk.green("sarra qr term 'Check this out' --small")}

  ${chalk.bold("URL QR codes:")}
  ${chalk.green("sarra qr url https://github.com")}
  ${chalk.green("sarra qr url https://example.com -o link.png -t")}

  ${chalk.bold("From file content:")}
  ${chalk.green("sarra qr file config.json")}
  ${chalk.green("sarra qr file data.txt -o data-qr.png -s 600 -t")}

  ${chalk.bold("Custom colors:")}
  ${chalk.green(
    "sarra qr generate 'Styled' --dark '#FF0000' --light '#FFFF00'"
  )}

${chalk.bold.cyan("ERROR CORRECTION LEVELS")}

  ${chalk.yellow("L")} - Low (7% recovery)
  ${chalk.yellow("M")} - Medium (15% recovery) ${chalk.gray("[default]")}
  ${chalk.yellow("Q")} - Quartile (25% recovery)
  ${chalk.yellow("H")} - High (30% recovery)

${chalk.bold.cyan("TERMINAL OUTPUT")}

  Use ${chalk.yellow("-t, --terminal")} on any command to display ASCII preview
  Use ${chalk.yellow("--small")} for compact terminal output
  Use ${chalk.yellow("sarra qr terminal")} for terminal-only output (no file)
`;
