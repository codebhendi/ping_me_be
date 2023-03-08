const { watch, series } = require('gulp');
const { compileTypescript, watchGlobs: tsWatchGlobs } = require('./gulp/compileTypescript');
const { startServer } = require('./gulp/nodemon');

const watchCompilation = () => {
  watch(tsWatchGlobs, compileTypescript);
};

exports.compileTypescript = compileTypescript;

function cleanAndStartDevServer(cb) {
  const tasks = [compileTypescript, startServer];
  return series(...tasks)(cb);
}

exports.default = series(cleanAndStartDevServer, watchCompilation);
