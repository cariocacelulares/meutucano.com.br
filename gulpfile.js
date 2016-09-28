var elixir = require('laravel-elixir');
require('laravel-elixir-angular');

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');

elixir.extend('customSass', function() {
    new elixir.Task('customSass', function() {
        return gulp.src(['resources/assets/sass/app.scss'])
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(rename('app.css'))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(cleanCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('public/assets/css'))
            .pipe(notify('Sass compiled!'));
    })
    .watch('resources/assets/sass/**/*.scss');
 });

elixir(function(mix) {
    mix
        .customSass()
        .angular("resources/assets/angular/components/",  "public/assets/js/src/", "components.js")
        .angular("resources/assets/angular/models/",      "public/assets/js/src/", "models.js")
        .angular("resources/assets/angular/controllers/", "public/assets/js/src/", "controllers.js")
        .angular("resources/assets/angular/services/",    "public/assets/js/src/", "services.js")
        .angular("resources/assets/angular/helpers/",     "public/assets/js/src/", "helpers.js")
        .angular("resources/assets/angular/directives/",  "public/assets/js/src/", "directives.js");
});