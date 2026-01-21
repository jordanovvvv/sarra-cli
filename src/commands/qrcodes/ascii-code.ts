import QRCode from "qrcode";
import chalk from "chalk";

// Display ASCII QR code
async function displayAscii(text: string, small: boolean = true) {
  const ascii = await QRCode.toString(text, {
    type: "terminal",
    small: small,
  } as any);
  console.log("\n" + chalk.bold("Terminal Preview:"));
  console.log(ascii);
}

export default displayAscii;
