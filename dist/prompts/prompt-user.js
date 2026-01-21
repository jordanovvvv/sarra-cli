"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptUser = promptUser;
exports.getSaveLocation = getSaveLocation;
const chalk_1 = __importDefault(require("chalk"));
const readline = __importStar(require("readline"));
const path = __importStar(require("path"));
// Function for user prompt
async function promptUser(question) {
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
async function getSaveLocation(defaultPath) {
    const cwd = process.cwd();
    const fullPath = path.resolve(cwd, defaultPath);
    console.log(chalk_1.default.cyan("\n📁 Save Location"));
    console.log(chalk_1.default.gray(`   Current directory: ${cwd}`));
    console.log(chalk_1.default.gray(`   Default file: ${defaultPath}`));
    console.log(chalk_1.default.gray(`   Full path: ${fullPath}\n`));
    const answer = await promptUser(`Save to current location? (Y/n/path): `);
    if (answer.toLowerCase() === "n" || answer.toLowerCase() === "no") {
        return null; // Don't save
    }
    else if (answer === "" ||
        answer.toLowerCase() === "y" ||
        answer.toLowerCase() === "yes") {
        return defaultPath; // Use default
    }
    else {
        return answer; // Use custom path
    }
}
