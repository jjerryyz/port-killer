#!/usr/bin/env node

import arg from "arg";
import * as exec from "./exec.js";
import { noop } from "./utils.js";
import isWsl from "is-wsl";
import os from 'os';
import chalk from 'chalk';
import * as parsers from "./parsers.js";

const netStatCmds = {
  linux: {
    cmd: "netstat",
    args: ["-apntu"],
  },
  darwin: {
    cmd: "netstat",
    args: ["-v", "-n", "-p", "tcp"],
  },
  win32: {
    cmd: "netstat.exe",
    args: ["-a", "-n", "-o"],
  },
};

const args = (function parseArgs() {
  const args = arg({
    "--list": Boolean,
    "--kill": Boolean,
    "--help": Boolean,
    '--platform': String,

    // align
    "-h": "--help",
    "-l": "--list",
  });

  // console.log("args", args);
  return args;
})();
const platform = args['--platform'] || (isWsl ? 'win32' : false) || os.platform();

const parser = parsers[platform];
const netStatCmd = netStatCmds[platform];

const getHelp = () => chalk`
  {bold.cyan port-killer} - Find and kill port tool for windows
  {bold USAGE}
      {bold $} {cyan port-killer} --help/-h
      {bold $} {cyan port-killer} [port]
      Like port-killer 9000
      {bold $} {cyan port-killer} --list/-l
      List All ports
      {bold $} {cyan port-killer} --kill
      Kill ports
`;

function findPort(handler) {
  const makeLineHandler = function (stopParsing) {
    return function (line) {
      if (parser(line, handler) === false) {
        stopParsing();
      }
    };
  };
  const done = noop;
  exec.sync(netStatCmd.cmd, netStatCmd.args, makeLineHandler, done);
}

function killProcess(pid) {
  exec.spawnSync('taskkill.exe', ['/T', '/F', '/PID', pid]);
}

function run() {
  if (args["--help"]) {
    console.log(getHelp());
    return;
  }

  const ports = args['_'] || [];

  if (args["--list"]) {
    findPort((line) => {
      const port = line.local.port;
      const pid = line.pid;
      console.info(`local port: ${port}, pid: ${pid}`);
    });
  } else {
    findPort((line) => {
      const port = line.local.port;
      const pid = line.pid;
      if (ports.length == 0) {
        console.info(`local port: ${port}, pid: ${pid}`);
      } else if (ports.indexOf(`${port}`) !== -1) {
        console.info(`local port: ${port}, pid: ${pid}`);
        if (args['--kill']) {
          killProcess(pid);
        }
      }
    });
  }
}

run();
