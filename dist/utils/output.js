"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOutputPath = resolveOutputPath;
const prompt_user_1 = require("../prompts/prompt-user");
async function resolveOutputPath(out, save, defaultPath) {
    if (out)
        return out;
    if (save)
        return (0, prompt_user_1.getSaveLocation)(defaultPath);
    return null;
}
