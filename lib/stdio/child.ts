import {spawn, exec, ChildProcess} from "child_process";
var argv = require('yargs').argv;

console.log(argv);
var serverPath = argv.serverPath;
console.log('serverPath', serverPath);
var projectPath = argv.projectPath;
console.log('projectPath', projectPath);

var childProcess = spawn(serverPath, ["--stdio", "-s", projectPath, "--hostPID", process.pid]);

process.stdin.pipe(childProcess.stdin);
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);

process.stdin.resume();
process.on('message', function(message) {
    if (message === 'kill')
        process.exit();
});
