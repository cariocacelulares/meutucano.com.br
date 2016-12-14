<?php

return [
    'name' => 'Core',
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
        'devolucao' => [1202, 2202, 1411],
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
];