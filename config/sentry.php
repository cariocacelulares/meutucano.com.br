<?php

return array(
    'dsn' => env('SENTRY_DSN', 'https://933ad761df37421295bfdba036a75311:caa79bab95f7454f847cca3e4fd9ff36@sentry.io/112695'),

    // capture release as git sha
    'release' => trim(exec('git log --pretty="%h" -n1 HEAD')),

    // Capture bindings on SQL queries
    'breadcrumbs.sql_bindings' => true,
);
