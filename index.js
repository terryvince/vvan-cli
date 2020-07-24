#!/usr/bin/env node
const path = require("path")
const {parseCommand} = require("./lib/command")

process.env.vvan_execPath = process.argv[1].split(path.sep + "index.js")[0]; //全局安装的命令的执行路径

parseCommand()