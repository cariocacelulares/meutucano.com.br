<!DOCTYPE html>
<html ng-app="MeuTucano" ng-cloak>
    <head lang="pt">
        <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <title>Meu Tucano</title>

        <link rel="stylesheet" href="assets/css/app.css" />

        <link rel="stylesheet" href="bower_components/angular-loading-bar/build/loading-bar.min.css" />
        <link rel="stylesheet" href="bower_components/ng-dialog/css/ngDialog.min.css" />
        <link rel="stylesheet" href="bower_components/ng-dialog/css/ngDialog-theme-default.min.css" />
        <link rel="stylesheet" href="bower_components/angular-date-picker/angular-date-picker.css" />

        <link rel="icon" type="image/x-icon" href="favicon.ico" />
    </head>

    <body class="fixed-header menu-behind">
        <div ui-view></div>

        <toaster-container toaster-options="{'close-button': true, 'position-class': 'toast-bottom-right'}"></toaster-container>
    </body>

    <!-- Application Dependencies -->
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="bower_components/satellizer/satellizer.min.js"></script>
    <script src="bower_components/ng-file-upload/ng-file-upload.min.js"></script>
    <script src="bower_components/angular-focus-it/angular-focus-it.min.js"></script>
    <script src="bower_components/ng-busy/build/angular-busy.min.js"></script>
    <script src="bower_components/angular-animate/angular-animate.min.js"></script>
    <script src="bower_components/AngularJS-Toaster/toaster.min.js"></script>
    <script src="bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
    <script src="assets/js/angular-pt_BR.js"></script>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/raphael/raphael.min.js"></script>

    <script src="bower_components/lodash/dist/lodash.min.js"></script>
    <script src="bower_components/restangular/dist/restangular.min.js"></script>

    <script src="bower_components/angular-auto-validate/dist/jcs-auto-validate.min.js"></script>

    <script src="bower_components/ng-dialog/js/ngDialog.min.js"></script>

    <script src="bower_components/moment/min/moment.min.js"></script>
    <script src="bower_components/moment/locale/pt-br.js"></script>
    <script src="bower_components/moment-timezone/builds/moment-timezone.min.js"></script>

    <script src="bower_components/angular-date-picker/angular-date-picker.js"></script>

    <script src="bower_components/ng-onload/release/ng-onload.min.js"></script>
    <script src="bower_components/angular-input-masks/angular-input-masks-standalone.min.js"></script>

    <script src="bower_components/angular-clipboard/angular-clipboard.js"></script>

    <script src="bower_components/ngstorage/ngStorage.min.js"></script>
    <script src="bower_components/ng-tags-input/ng-tags-input.min.js"></script>

    <!-- Application Scripts -->
    <script src="assets/js/app.js"></script>

    <script src="assets/js/src/services.js"></script>
    <script src="assets/js/src/directives.js"></script>
    <script src="assets/js/src/controllers.js"></script>
    <script src="assets/js/src/components.js"></script>
    <script src="assets/js/src/models.js"></script>
    <script src="assets/js/src/helpers.js"></script>

    <script src="assets/js/config.js"></script>
    <script src="assets/js/routes.js"></script>
</html>