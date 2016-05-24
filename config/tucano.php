<?php

return [
    /**
     * CEP Padrão de envio
     */
    'cep' => '89160314',

    /**
     * Operações fiscais
     */
    'operacoes' => [5102, 5405, 6102, 6108, 6910],
    'devolucao' => [1202, 2202, 1411],

    /**
     * Iniciais frete
     */
    'pac'   => ['PE', 'PI', 'PJ'],
    'sedex' => ['DJ', 'DN', 'DM', 'DU', 'DV', 'DW'],

    /**
     * Feriados
     */
    'feriados' => [
        '01/01',
        '02/02',
        date('d/m', (easter_date(date('Y'))) - (46 * 86400)),
        date('d/m', (easter_date(date('Y'))) - (47 * 86400)),
        date('d/m', (easter_date(date('Y'))) - (2 * 86400)),
        date('d/m', (easter_date(date('Y')))),
        '21/04',
        '01/05',
        date('d/m', (easter_date(date('Y'))) + (60 * 86400)),
        '07/09',
        '20/09',
        '12/10',
        '02/11',
        '15/11',
        '25/12'
    ],

    /**
     * Status de rastreio
     */
    'status' => [
        0 => 'Pendente',
        1 => 'Normal',
        2 => 'Atrasado',
        3 => 'Extraviado',
        4 => 'Entregue',
        5 => 'Devolvido',
        6 => 'Retirada',
        7 => 'Tratado',
        8 => 'Solucionado',
    ],

    'devolucao_status' => [
        0 => 'Endereço insuficiente',
        1 => 'Não procurado (Retirada)',
        2 => 'Endereço incorreto',
        3 => 'Destinatário desconhecido',
        4 => 'Recusado',
        5 => 'Defeito',
        6 => 'Mudança',
        7 => 'Outro'
    ],

    /**
     * Excluir CNPJs da meta
     */
    'excluir_cnpj' => [
        '06971234000162',
        '06971234000243',
        '06971234000324',
        '10722871000172',
    ],

    /**
     * Configurações de contrato com correios
     */
    'correios' => [
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

    /**
     * Acesso da API da AnyMarket
     */
    'anymarket' => [
        'api' => [
            'usuario' => 'dev@cariocacelulares.com.br',
            'senha'   => '123',
            'token'   => 'LG1457642434456R-1352804551',
            'url'     => 'http://sandbox-api.anymarket.com.br/v2',
        ]
    ]
];
