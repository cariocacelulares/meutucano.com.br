<?php

return [
    'name' => 'Skyhub',
    'enabled' => env('SKYHUB_ENABLED', true),
    'api' => [
        'email'   => 'dev@cariocacelulares.com.br',
        'token'   => env('SKYHUB_TOKEN', 'ciBmtUvQviXkcey7tkPb'),
        'url'     => 'http://in.skyhub.com.br',
    ],
    'old_order' => 4
];
