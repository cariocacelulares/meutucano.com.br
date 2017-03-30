<?php

return [
    'name' => 'Mercadolivre',

    'enabled' => env('MERCADOLIVRE_ENABLED', true),

    'api' => [
        'app_id'       => '3025600389683343',
        'secret'       => 'nVbbqa2T6FcYOjSLkS5MeIhITEtrR8cv',
        'url'          => 'https://api.mercadolibre.com',
        'callback_url' => url('mercadolivre/auth/callback'),
        'redirect_url' => url('/#/app/produtos/mercadolivre/ads/list')
    ]
];
