import chalk from "chalk";

export function prettyHelp(text: string): string {
  return (
    text
      // Section headers
      .replace(/^Global Options:/gm, chalk.bold.cyan("\nGLOBAL OPTIONS"))
      .replace(/^Examples:/gm, chalk.bold.cyan("\nEXAMPLES"))
      .replace(/^Notes:/gm, chalk.bold.cyan("\nNOTES"))

      // Comments
      .replace(/^# (.*)$/gm, (_, m) => chalk.gray(`# ${m}`))

      // Commands
      .replace(/^sarra .*/gm, (m) => chalk.green(m))

      // Flags
      .replace(/(--[a-z-]+)/g, chalk.yellow("$1"))

      // Bullets
      .replace(/^• (.*)$/gm, (_, m) => chalk.dim(`• ${m}`))
  );
}
