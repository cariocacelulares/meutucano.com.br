var elixir = require('laravel-elixir');

require('laravel-elixir-angular');

elixir(function(mix) {
    mix
        .sass('app.scss', 'public/assets/css', 'app.css')
        .angular("resources/assets/angular/components/", "public/assets/js/src/", "components.js")
        .angular("resources/assets/angular/filters/", "public/assets/js/src/", "filters.js")
        .angular("resources/assets/angular/models/", "public/assets/js/src/", "models.js") 
        .angular("resources/assets/angular/controllers/", "public/assets/js/src/", "controllers.js")
        .angular("resources/assets/angular/services/",    "public/assets/js/src/", "services.js")
        .angular("resources/assets/angular/directives/",  "public/assets/js/src/", "directives.js");
});
