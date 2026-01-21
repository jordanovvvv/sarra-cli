import chalk from "chalk";
import * as readline from "readline";
import * as path from "path";

// Function for user prompt
export async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Helper function to ask about save location
export async function getSaveLocation(
  defaultPath: string
): Promise<string | null> {
  const cwd = process.cwd();
  const fullPath = path.resolve(cwd, defaultPath);

  console.log(chalk.cyan("\n📁 Save Location"));
  console.log(chalk.gray(`   Current directory: ${cwd}`));
  console.log(chalk.gray(`   Default file: ${defaultPath}`));
  console.log(chalk.gray(`   Full path: ${fullPath}\n`));

  const answer = await promptUser(`Save to current location? (Y/n/path): `);

  if (answer.toLowerCase() === "n" || answer.toLowerCase() === "no") {
    return null; // Don't save
  } else if (
    answer === "" ||
    answer.toLowerCase() === "y" ||
    answer.toLowerCase() === "yes"
  ) {
    return defaultPath; // Use default
  } else {
    return answer; // Use custom path
  }
}
