<?php

$conn = new \SoapClient(
    'http://www.cariocacelulares.com.br/api/v2_soap/?wsdl',
    [
        'stream_context' => stream_context_create([
            'http' => [
                'user_agent' => 'PHPSoapClient'
            ]
        ]),
        'trace' => true,
        'exceptions' => true,
        'connection_timeout' => 20,
        'cache_wsdl' => WSDL_CACHE_NONE
    ]
);

var_dump($conn);

$login = $conn->login(
    'carioca',
    '#@carioca2016'
);

var_dump($login);