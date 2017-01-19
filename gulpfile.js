var elixir       = require('laravel-elixir');
var angular      = require('laravel-elixir-angular');
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var ngmin        = require('gulp-ngmin');
var cleanCss     = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var notify       = require('gulp-notify');
var gulpUtil     = require('gulp-util');
var livereload   = require('gulp-livereload');
var lib          = require('bower-files')();

elixir.extend('html', function() {
    var task = new elixir.Task('html', function() {
        return gulp.src(['public/views/**/*.html'])
            .pipe(livereload());
    });

    task.watch('public/views/**/*.html');
});

elixir.extend('customSass', function() {
    var task = new elixir.Task('customSass', function() {
        return gulp.src(['resources/assets/sass/app.scss'])
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', notify.onError(function(error) {
                gulpUtil.log(error);
                return error.message;
            })))
            .pipe(rename('app.min.css'))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(cleanCss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('public/assets/css'))
            .pipe(notify('Sass compiled!'))
            .pipe(livereload());
    });

    task.run();
    task.watch('resources/assets/sass/**/*.scss');
});

elixir.extend('angularMinify', function() {
    var task = new elixir.Task('angularMinify', function() {
        return gulp.src("resources/assets/angular/**/*.js")
            .pipe(sourcemaps.init())
            .pipe(ngmin().on('error', notify.onError(function(error) {
                gulpUtil.log(error);
                return error.message;
            })))
            .pipe(concat('app.min.js'))
            .pipe(uglify({mangle: false}).on('error', notify.onError(function(error) {
                gulpUtil.log(error);
                return error.message;
            })))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('public/assets/js/'))
            .pipe(notify('JS compiled!'))
            .pipe(livereload());
    });

    task.run();
    task.watch('resources/assets/angular/**/*.js');
});

elixir.extend('bowerJs', function() {
    var task = new elixir.Task('bowerJs', function() {
        return gulp.src(lib.ext('js').files)
            .pipe(concat('lib.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/assets/js'))
            .pipe(notify('Bower JS compiled!'))
            .pipe(livereload());
    });

    task.run();
});

elixir.extend('bowerCss', function() {
    var task = new elixir.Task('bowerCss', function() {
        return gulp.src(lib.ext('css').files)
            .pipe(concat('lib.min.css'))
            .pipe(cleanCss())
            .pipe(gulp.dest('public/assets/css'))
            .pipe(notify('Bower CSS compiled!'))
            .pipe(livereload());
    });

    task.run();
});

elixir(function(mix) {
    livereload.listen();

    mix
        .customSass()
        .angularMinify()
        .bowerJs()
        .bowerCss()
        .html();
});
