import { exec } from 'child_process';
import arg from 'arg';


function exec_cmd(cmd, callback) {
  console.log('exec_cmd', cmd);
  const ls = exec(cmd, callback);

  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

const args = arg({
  '--list': [String],
  '--kill': [Number],
  '--help': Boolean,

  // align
  '-h': '--help',
  '-l': '--list'
});

console.log('args', args);

if (!args['--list']) {
  args['--list'] = [];
}
exec_cmd('netstat -aon', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  // console.log(`stdout: ${stdout}`);
  console.log('fffffffffffffffffffffff', stdout.split('\r\n')[5]);
  console.error(`stderr: ${stderr}`);
});
