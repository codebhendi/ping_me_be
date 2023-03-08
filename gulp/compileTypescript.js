const { src, dest } = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const JSON5 = require('json5');
const fs = require('fs');

const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json').toString());

const tsProject = typescript.createProject('tsconfig.json', {
  declaration: false,
  declarationMap: false,
});

const compileTypescript = () =>
  src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject(typescript.reporter.longReporter()))
    .pipe(sourcemaps.write())
    .pipe(dest('lib'));

const watchGlobs = tsConfig.include;

module.exports = {
  compileTypescript,
  watchGlobs,
};
