'use strict';
const path = require('path');
const gulp = require('gulp');
const pkg = require('./package.json');
const $ = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');
const importOnce = require('node-sass-import-once');
const stylemod = require('gulp-style-modules');
const browserSync = require('browser-sync').create();


const sassOptions = {
  importer: importOnce,
  importOnce: {
    index: true,
    bower: true
  }
};

gulp.task('clean', function() {
  return gulp.src(['.tmp', 'css'], {
    read: false
  }).pipe($.clean());
});

gulp.task('sass', function() {
  return gulp.src(`./sass/${pkg.name}-predix.scss`)
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'Safari 8.0'],
      cascade: false
    }))
    .pipe($.rename(`${pkg.name}.css`))
    .pipe(gulp.dest('css'))
    .pipe(stylemod({
      // All files will be named 'styles.html'
      filename: 'styles',
      // Use '-css' suffix instead of '-styles' for module ids
      moduleId: function(file) {
        return path.basename(file.path, path.extname(file.path)) + '-css';
      }
    }))
    .pipe($.rename(`${pkg.name}-styles.html`))
    .pipe(gulp.dest('.'))
    // .pipe(browserSync.stream());
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('css', function() {
  return gulp.src('css/**/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.cssmin())
    .pipe($.concat(pkg.name + '.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.scss', ['default']);
});

gulp.task('serve', ['default'], function() {
  browserSync.init({
    port: 8080,
    notify: false,
    reloadOnRestart: true,
    logPrefix: `${pkg.name}`,
    https: false,
    files: ['*.*'],
    server: ['./', 'bower_components'],
  });

  gulp.watch(['!${pkg.name}-styles.html', '*.html', 'bower_components/**/*.html']).on('change', browserSync.reload);
  gulp.watch('sass/*.scss', ['default']);

});

// gulp.task('bump', function() {
//
// });
//
// gulp.task('hint', function() {
//
// });

gulp.task('default', gulpSequence('clean', 'sass', 'css'));
