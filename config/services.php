<?php

return [

    'mailgun' => [
        'domain' => 'cariocacelulares.com.br',
        'secret' => 'key-dfba1de964cb76c974908889f329402e',
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET', '3cb5ebe467df34b4f75c5a9e70b0afa4b7db0c13'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

];
