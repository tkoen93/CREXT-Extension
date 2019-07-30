var browserify = require('browserify');
var gulp = require('gulp');
var terser = require('gulp-terser');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var sass = require('gulp-sass');
var zip = require('gulp-zip');
const manifest = require('./app/manifest.json');
const jsoneditor = require('gulp-json-editor');

// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('app/src/crext.css')
    // Compile SASS files
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('dist/chrome/src'))
    .pipe(gulp.dest('dist/firefox/src'))
});

//copy static folders to build directory
gulp.task('copy', function() {
	gulp.src('app/fonts/**')
		.pipe(gulp.dest('dist/chrome/fonts'))
    .pipe(gulp.dest('dist/firefox/fonts'));
	gulp.src('app/img/**')
		.pipe(gulp.dest('dist/chrome/img'))
    .pipe(gulp.dest('dist/firefox/img'));
	gulp.src('app/_locales/**')
		.pipe(gulp.dest('dist/chrome/_locales'))
    .pipe(gulp.dest('dist/firefox/_locales'));
  gulp.src('app/src/bootstrap336.min.css')
		.pipe(gulp.dest('dist/chrome/src'))
    .pipe(gulp.dest('dist/firefox/src'));
  gulp.src('app/src/node.json')
		.pipe(gulp.dest('dist/chrome/src'))
    .pipe(gulp.dest('dist/firefox/src'));
  gulp.src('app/src/nodemainnet.json')
		.pipe(gulp.dest('dist/chrome/src'))
    .pipe(gulp.dest('dist/firefox/src'));
  gulp.src('app/src/popup.html')
    .pipe(gulp.dest('dist/chrome/src'))
    .pipe(gulp.dest('dist/firefox/src'));
	return gulp.src('app/manifest.json')
		.pipe(gulp.dest('dist/chrome'))
    .pipe(gulp.dest('dist/firefox'));
});

gulp.task('manifest:chrome', function() {
  return gulp.src('dist/chrome/manifest.json')
  .pipe(jsoneditor(function (json) {
    delete json.applications
    return json
  }))
  .pipe(gulp.dest('dist/chrome', { overwrite: true }))
});



gulp.task('content', function() {
  return browserify('./app/src/scripts.js')
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('background', function() {
  return browserify('./app/src/background.js')
    .bundle()
    .pipe(source('background.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('inject', function() {
  return browserify('./app/src/inject.js')
    .bundle()
    .pipe(source('inject.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('crext', function() {
  return browserify('./app/src/CreditsExtension.js')
    .bundle()
    .pipe(source('CreditsExtension.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('contents', function() {
  return browserify('./app/src/contentscript.js')
    .bundle()
    .pipe(source('contentscript.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('build', gulp.parallel('copy', 'content', 'background', 'inject', 'crext', 'contents', 'manifest:chrome', 'styles'));

gulp.task('content-dev', function() {
  return browserify('./app/src/scripts.js')
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('background-dev', function() {
  return browserify('./app/src/background.js')
    .bundle()
    .pipe(source('background.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('inject-dev', function() {
  return browserify('./app/src/inject.js')
    .bundle()
    .pipe(source('inject.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('crext-dev', function() {
  return browserify('./app/src/CreditsExtension.js')
    .bundle()
    .pipe(source('CreditsExtension.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});

gulp.task('contents-dev', function() {
  return browserify('./app/src/contentscript.js')
    .bundle()
    .pipe(source('contentscript.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest('./dist/chrome/src'))
    .pipe(gulp.dest('./dist/firefox/src'));
});


gulp.task('build-dev', gulp.series('copy', 'content-dev', 'background-dev', 'inject-dev', 'crext-dev', 'contents-dev', 'manifest:chrome', 'styles'));

gulp.task('dist-chrome', function() {
  return gulp.src('./dist/chrome/**')
          .pipe(zip('chrome.zip'))
          .pipe(gulp.dest('dist'));
});

gulp.task('dist-firefox', function() {
  return gulp.src('./dist/firefox/**')
          .pipe(zip('firefox.zip'))
          .pipe(gulp.dest('dist'));
});

gulp.task('dist', gulp.parallel('dist-chrome', 'dist-firefox'));

gulp.task('production', gulp.series('build', 'dist'));

gulp.task('production-dev', gulp.series('build-dev', 'dist'));
