var exec = require('child_process').exec;

jobs = [
    "cd ./three && npm install",
    "cd ./vue && npm install",
    "cd ./arjs/examples && npm install"
];

function onExec(error, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    if (error !== null) {
        console.log('exec error: ' + error.code);
        process.exit(error.code);
    } else {
        runJob();
    }
}

function runJob() {
    if (!jobs.length) {
        console.log('\nJobs completed');
        return;
    }
    var cmd = jobs.shift();

    if (typeof cmd === 'function') {
        cmd();
        runJob();
        return;
    }

    console.log('\nRunning command: ' + cmd + '\n');
    exec(cmd, onExec);
}

runJob();