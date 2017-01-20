<?php

return [
    'name' => 'Magento',
    'enabled' => env('MAGENTO_ENABLED', true),
    'api' => [
        'host' => env('MAGENTO_API_HOST', 'https://www.cariocacelulares.com.br/api/v2_soap/?wsdl'),
        'user' => env('MAGENTO_API_USER', 'carioca'),
        'key'  => env('MAGENTO_API_KEY', '#@carioca2016')
    ],
    'old_order' => [
        'boleto'  => 5,
        'credito' => 5
    ],

    /**
     * Micro-serviços
     */
    'tucanomg' => [
        'enabled' => env('TUCANOMG_ENABLED', true),
        'host'  => 'http://servicos.cariocacelulares.com.br/tucanomg/public/',
        'token' => '#@carioca2016servicetoken'
    ]
];
