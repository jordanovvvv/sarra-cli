"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowCommand = void 0;
const commander_1 = require("commander");
exports.nowCommand = new commander_1.Command("now")
    .description("Current timestamp")
    .action(() => {
    console.log(new Date().toISOString());
});
