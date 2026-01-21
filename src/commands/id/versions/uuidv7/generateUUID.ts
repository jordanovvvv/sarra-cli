import crypto from "crypto";

// Time based UUID v7 generation
function uuidV7(): string {
  const now = Date.now(); // milliseconds since Unix epoch

  // 48-bit timestamp
  const timeHex = now.toString(16).padStart(12, "0");

  // 80 bits of randomness
  const rand = crypto.randomBytes(10).toString("hex");

  // UUID v7 format:
  // time(12) - time(4) - version(1) + rand(3) - variant(1) + rand(3) - rand(12)
  return (
    timeHex.slice(0, 8) +
    "-" +
    timeHex.slice(8, 12) +
    "-" +
    "7" +
    rand.slice(0, 3) +
    "-" +
    ((parseInt(rand.slice(3, 4), 16) & 0x3) | 0x8).toString(16) +
    rand.slice(4, 7) +
    "-" +
    rand.slice(7, 19)
  );
}

export { uuidV7 };
