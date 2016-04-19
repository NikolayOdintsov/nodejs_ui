var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');

var changed = require('gulp-changed');

// include plug-ins minify js
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

// include plug-ins minify css
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// include plug-ins minify html
var minifyHTML = require('gulp-minify-html');

// JS hint task
gulp.task('jshint', function() {
	gulp.src('./src/scripts/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});


// JS concat, strip debugging and minify
gulp.task('scripts', function() {
	gulp.src(['./src/scripts/lib.js','./src/scripts/*.js'])
	.pipe(concat('script.js'))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(gulp.dest('./build/scripts/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
	gulp.src(['./src/styles/*.css'])
	.pipe(concat('styles.css'))
	.pipe(autoprefix('last 2 versions'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('./build/styles/'));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// automation
gulp.task('default', ['htmlpage', 'scripts', 'styles'], function() {
  // watch for HTML changes
  gulp.watch('./src/*.html', function() {
    gulp.run('htmlpage');
  });

  // watch for JS changes
  gulp.watch('./src/scripts/*.js', function() {
    gulp.run('jshint', 'scripts');
  });

  // watch for CSS changes
  gulp.watch('./src/styles/*.css', function() {
    gulp.run('styles');
  });

  gulp.run('server')

  gulp.watch(['./src/scripts/*.js'], function() {
    gulp.run('server')
  })
});

var child_process = require('child_process');

var spawn = require('child_process').spawn, node;

gulp.task('server start', function (cb) {
  child_process.exec('node ./build/scripts/script.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['./src/scripts/main.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})