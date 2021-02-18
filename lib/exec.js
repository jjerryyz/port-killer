import {spawnSync} from 'child_process';
export * from 'child_process';
import {parseLines} from './utils.js';

export const sync = function (cmd, args, makeLineHandler, done) {
  var processing = true;
  var lineHandler = makeLineHandler(function () {
      processing = false;
  });

  var proc = spawnSync(cmd, args);
  if (proc.error) {
      return done(proc.error);
  }

  var lines = parseLines(proc.stdout);
  for (var i = 0; i < lines.length && processing; i++) {
      lineHandler(lines[i]);
  }

  return done(null);
};