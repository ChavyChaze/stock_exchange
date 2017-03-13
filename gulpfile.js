var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');

var dest = "src/app-content/"


gulp.task('styles', function () {
    return sass(dest + '/*.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('public/css'))
        .pipe(livereload());
});

gulp.task('scripts', function () {
    return gulp.src('src/**/*.js')
        .pipe(livereload());
});

gulp.task('ejs', function () {
    return gulp.src('backend/views/**/*.ejs')
        .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(dest + '**/*.scss', ['styles']);
    gulp.watch(dest + '**/*.js', ['scripts']);
});

gulp.task('server', function () {
    nodemon({
        'script': 'server.js',
        'ignore': 'public/js/*.js'
    });
});

gulp.task('serve', ['watch']);  
