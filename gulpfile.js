const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    styles: {
        src: 'views/**/*.styl',
        dest: 'public/styles/'
    },
    scripts: {
        src: 'views/**/*.js',
        dest: 'public/scripts/'
    },
    views: {
        src: 'views/**/*.pug'
    }
};

// Styles Task
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(stylus())
        .pipe(concat('main.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Scripts Task
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Watch Task
function watch() {
    browserSync.init({
        proxy: "localhost:3000",
        notify: true
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.views.src).on('change', browserSync.reload);
}

// Default Task
gulp.task('default', watch);

gulp.task('build', gulp.series(styles, scripts)) 
