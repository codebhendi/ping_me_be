const nodemon = require('gulp-nodemon');
const { spawn } = require('child_process');

const packageJSON = require('../package.json');

let bunyan;

function startServer(cb) {
  const stream = nodemon({
    ...packageJSON.nodemonConfig,
  });
  stream.on('readable', function () {
    bunyan && bunyan.kill();
    bunyan = spawn('./node_modules/.bin/bunyan', ['--color']);
    bunyan.stdout.pipe(process.stdout);

    this.stdout.pipe(bunyan.stdin);
  });
  stream.on('start', cb);
}

module.exports = {
  startServer,
};
