<?php

return [
    'name' => 'Correios',

    'api' => [
        'accessData' => [
            'usuario'           => '9912380773',
            'senha'             => 'eymos8',
            'codAdministrativo' => '15248798',
            'numeroContrato'    => '9912380773',
            'cartaoPostagem'    => '71351612',
            'cnpjEmpresa'       => '14619408000150',
            'anoContrato'       => null,
            'diretoria'         => new \PhpSigep\Model\Diretoria(\PhpSigep\Model\Diretoria::DIRETORIA_DR_SANTA_CATARINA),
        ],
        'remetente' => [
            'nome'        => 'CARIOCA',
            'telefone'    => '(47) 3521-3280',
            'rua'         => 'AVENIDA OSCAR BARCELOS',
            'numero'      => '1876',
            'complemento' => 'SALA 1',
            'bairro'      => 'SANTANA',
            'cep'         => '89160-314',
            'uf'          => 'SC',
            'cidade'      => 'RIO DO SUL',
        ]
    ],
];
