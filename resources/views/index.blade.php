<!DOCTYPE html>
<html ng-app="MeuTucano" ng-cloak>
    <head lang="pt">
        <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="robots" content="noindex, nofollow" />

        <title>Meu Tucano</title>

        <link rel="stylesheet" href="{{ Cdn::asset('assets/css/lib.min.css') }}" />
        <link rel="stylesheet" href="{{ Cdn::asset('assets/css/app.min.css') }}" />

        <link rel="icon" type="image/x-icon" href="{{ Cdn::asset('assets/img/favicon.ico') }}" />
    </head>

    <body class="fixed-header menu-behind">
        <div ui-view></div>

        <toaster-container toaster-options="{'close-button': true, 'position-class': 'toast-bottom-right'}"></toaster-container>
    </body>

    <!-- Application Dependencies -->
    <script src="{{ Cdn::asset('assets/js/lib.min.js') }}"></script>

    <!-- Application Scripts -->
    <script src="{{ Cdn::asset('assets/js/app.min.js') }}"></script>

    <script>
        Raven
            .config('https://933ad761df37421295bfdba036a75311@sentry.io/112695')
            .addPlugin(Raven.Plugins.Angular)
            .install();
    </script>
</html>