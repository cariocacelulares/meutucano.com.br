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
var lib          = require('bower-files')();

elixir.extend('customSass', function() {
    new elixir.Task('customSass', function() {
        return gulp.src(['resources/assets/sass/app.scss'])
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(rename('app.min.css'))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(cleanCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('public/assets/css'))
            .pipe(notify('Sass compiled!'));
    })
    .watch('resources/assets/sass/**/*.scss');
});

elixir.extend('angularMinify', function() {
    new elixir.Task('angularMinify', function() {
        return gulp.src("resources/assets/angular/**/*.js")
            .pipe(ngmin().on('error', gulpUtil.log))
            .pipe(concat('app.min.js'))
            .pipe(uglify({mangle: false}).on('error', gulpUtil.log))
            .pipe(gulp.dest('public/assets/js/'))
            .pipe(notify('JS compiled!'));
    })
    .watch('resources/assets/angular/**/*.js');
});

elixir.extend('bowerJs', function() {
    new elixir.Task('bowerJs', function() {
        return gulp.src(lib.ext('js').files)
            .pipe(concat('lib.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/assets/js'));
    });
});

elixir.extend('bowerCss', function() {
    new elixir.Task('bowerCss', function() {
        return gulp.src(lib.ext('css').files)
            .pipe(concat('lib.min.css'))
            .pipe(cleanCss())
            .pipe(gulp.dest('public/assets/css'));
    });
});

elixir(function(mix) {
    mix
        .customSass()
        .angularMinify()
        .bowerJs()
        .bowerCss();
});