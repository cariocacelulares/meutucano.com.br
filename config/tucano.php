<?php

return [
    'email_send_enabled' => env('EMAIL_SEND_ENABLED', true),
    'report_email' => env('REPORT_EMAIL', 'dev@cariocacelulares.com.br'),
    /**
     * CEP Padrão de envio
     */
    'uf'  => 'SC',
    'cep' => '89160314',

    /**
     * Estados/UF
     */
    'estados_uf' => [
        "AC" => "Acre",
        "AL" => "Alagoas",
        "AM" => "Amazonas",
        "AP" => "Amapá",
        "BA" => "Bahia",
        "CE" => "Ceará",
        "DF" => "Distrito Federal",
        "ES" => "Espírito Santo",
        "GO" => "Goiás",
        "MA" => "Maranhão",
        "MT" => "Mato Grosso",
        "MS" => "Mato Grosso do Sul",
        "MG" => "Minas Gerais",
        "PA" => "Pará",
        "PB" => "Paraíba",
        "PR" => "Paraná",
        "PE" => "Pernambuco",
        "PI" => "Piauí",
        "RJ" => "Rio de Janeiro",
        "RN" => "Rio Grande do Norte",
        "RO" => "Rondônia",
        "RS" => "Rio Grande do Sul",
        "RR" => "Roraima",
        "SC" => "Santa Catarina",
        "SE" => "Sergipe",
        "SP" => "São Paulo",
        "TO" => "Tocantins"
    ],

    /**
     * Operações fiscais
     */
    'notas' => [
        'operacoes' => [5102, 5405, 6102, 6108, 6910],
        'devolucao' => [1202, 2202],
        'estorno' => [1949, 2949],

        'venda_interna' => 5102,
        'venda_externa' => 6108,
    ],

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
        '12/10',
        '02/11',
        '15/11',
        '25/12'
    ],

    /**
     * Meses do ano
     */
    'meses' => [
        1 => 'Janeiro',
        2 => 'Fevereiro',
        3 => 'Março',
        4 => 'Abril',
        5 => 'Maio',
        6 => 'Junho',
        7 => 'Julho',
        8 => 'Agosto',
        9 => 'Setembro',
        10 => 'Outubro',
        11 => 'Novembro',
        12 => 'Dezembro',
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
     * Status do pedido
     */
    'pedido_status' => [
        0 => 'Pendente',
        1 => 'Pago',
        2 => 'Enviado',
        3 => 'Entregue',
        5 => 'Cancelado'
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
     * Marketplaces com protocolo obrigatório para cancelamento
     */
    'required_protocolo' => [
        'b2w',
        'cnova'
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
     * Skyhub
     */
    'skyhub' => [
        'enabled' => env('SKYHUB_ENABLED', true),
        'api' => [
            'email'   => 'dev@cariocacelulares.com.br',
            'token'   => env('SKYHUB_TOKEN', 'ciBmtUvQviXkcey7tkPb'),
            'url'     => 'http://in.skyhub.com.br',
        ],
        'old_order' => 4
    ],

    /**
     * Micro-serviços
     */
    'services' => [
        'tucanomg' => [
            'enabled' => env('TUCANOMG_ENABLED', true),
            'host'  => 'http://servicos.cariocacelulares.com.br/tucanomg/public/',
            'token' => '#@carioca2016servicetoken'
        ]
    ]
];
