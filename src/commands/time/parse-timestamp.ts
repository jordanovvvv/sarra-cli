export function parseTimestamp(timestamp: string): Date {
  let date: Date;

  if (/^-?\d+$/.test(timestamp)) {
    const value = Number(timestamp);
    date = Math.abs(value) < 10_000_000_000
      ? new Date(value * 1000)
      : new Date(value);
  } else {
    date = new Date(timestamp);
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid timestamp");
  }

  return date;
}
