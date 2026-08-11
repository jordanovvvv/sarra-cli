"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimestamp = parseTimestamp;
function parseTimestamp(timestamp) {
    let date;
    if (/^-?\d+$/.test(timestamp)) {
        const value = Number(timestamp);
        date = Math.abs(value) < 10000000000
            ? new Date(value * 1000)
            : new Date(value);
    }
    else {
        date = new Date(timestamp);
    }
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid timestamp");
    }
    return date;
}
