const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');

// Paths
const paths = {
  server: {
    src: 'server.js'
  },
  models: {
    src: 'models/**/*.js'
  },
  views: {
    src: 'views/**/*.pug'
  },
  controllers: {
    src: 'controllers/**/*.js'
  },
  styles: {
    src: 'views/**/*.styl',
    dest: 'public/site/styles/'
  },
  scripts: {
    src: 'views/**/*.js',
    dest: 'public/site/scripts/'
  },
  assets: {
    src: 'public/site/assets/**/*'
  },
  fomantic_scripts: {
    src: 'semantic/dist/**/*.min.js',
    dest: 'public/site/assets/vendors/fomantic/'
  },
  fomantic_styles: {
    src: 'semantic/dist/**/*.min.css',
    dest: 'public/site/assets/vendors/fomantic/'
  },
  fomantic_themes: {
    src: 'semantic/dist/themes/**/*',
    dest: 'public/site/assets/vendors/themes/'
  }
};

// Styles Task
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Scripts Task
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// fomantic UI Script Task
function fomantic_scripts() {
  return gulp
    .src(paths.fomantic_scripts.src)
    .pipe(concat('fomantic.js'))
    .pipe(uglify())
    .pipe(rename('fomantic.min.js'))
    .pipe(gulp.dest(paths.fomantic_scripts.dest))
    .pipe(browserSync.stream());
}

// Fomantic UI Styles Task
function fomantic_styles() {
  return gulp
    .src(paths.fomantic_styles.src)
    .pipe(concat('fomantic.css'))
    .pipe(cssnano())
    .pipe(rename('fomantic.min.css'))
    .pipe(gulp.dest(paths.fomantic_styles.dest))
    .pipe(browserSync.stream());
}

// Fomantic UI Themes Task
function fomantic_themes() {
  return gulp
    .src(paths.fomantic_themes.src)
    .pipe(gulp.dest(paths.fomantic_themes.dest))
    .pipe(browserSync.stream());
}

// Watch Task
function watch() {
  browserSync.init({
    proxy: 'localhost:3000',
    notify: true,
    open: false
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp
    .watch([
      paths.server.src,
      paths.assets.src,
      paths.views.src,
      paths.models.src,
      paths.controllers.src
    ])
    .on('change', browserSync.reload);
}

// Default Task
gulp.task('default', watch);

// Build Task
gulp.task('build', gulp.series(scripts, styles));

// Fomantic UI Task
gulp.task(
  'fomantic',
  gulp.series(fomantic_scripts, fomantic_styles, fomantic_themes)
);
