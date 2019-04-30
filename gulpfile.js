var browserify = require('browserify');
var gulp = require('gulp');
var terser = require('gulp-terser');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('content', function() {
  return browserify('./app/src/scripts.js')
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('background', function() {
  return browserify('./app/src/background.js')
    .bundle()
    .pipe(source('background.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('inject', function() {
  return browserify('./app/src/inject.js')
    .bundle()
    .pipe(source('inject.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('crext', function() {
  return browserify('./app/src/CreditsExtension.js')
    .bundle()
    .pipe(source('CreditsExtension.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('tx', function() {
  return browserify('./app/src/tx.js')
    .bundle()
    .pipe(source('tx.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('contents', function() {
  return browserify('./app/src/contentscript.js')
    .bundle()
    .pipe(source('contentscript.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('build', gulp.parallel('content', 'background', 'inject', 'crext', 'tx', 'contents'));

gulp.task('content-dev', function() {
  return browserify('./app/src/scripts.js')
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('background-dev', function() {
  return browserify('./app/src/background.js')
    .bundle()
    .pipe(source('background.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('inject-dev', function() {
  return browserify('./app/src/inject.js')
    .bundle()
    .pipe(source('inject.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('crext-dev', function() {
  return browserify('./app/src/CreditsExtension.js')
    .bundle()
    .pipe(source('CreditsExtension.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('tx-dev', function() {
  return browserify('./app/src/tx.js')
    .bundle()
    .pipe(source('tx.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/src'));
});

gulp.task('build-dev', gulp.series('content-dev', 'background-dev', 'inject-dev', 'crext-dev', 'tx-dev'));
