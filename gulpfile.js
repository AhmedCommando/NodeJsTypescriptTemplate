const gulp = require('gulp'),
    spawn = require('child_process').spawn,
    changed = require('gulp-changed'),
    livereload = require('gulp-livereload');

let node;

const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];


// Here goes the env vrbles for dev
var env = Object.create( process.env );
env.KEY = 'test';
env.DEBUG = 'http node';

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js
          .pipe(changed('src'))
          .pipe(gulp.dest('build'))
          .pipe(livereload())
          
});

gulp.task('copyCert', function() {
  gulp.src('src/bin/ssl/**/*.pem')
  .pipe(gulp.dest('build/bin/ssl'));
});

gulp.task('server', function() {
  gulp.start('build', function() {
    if (node) node.kill()
    node = spawn('node', ['build/bin/www.js'], {stdio: 'inherit', env: env})
    node.on('close', function (code) {
      if (code === 8) {
        gulp.log('Error detected, waiting for changes...');
      }
    });
  }) 
})

gulp.task('start', function(){
  gulp.start('copyCert')
  gulp.start('server')
  livereload.listen()
  gulp.watch(['./src/*', './src/**/*.ts'], function() {
    gulp.start('server')
  })
});

// clean up if an error goes unhandled.
process.on('exit', function() {
  if (node) node.kill()
})