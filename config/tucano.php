<?php

return [
    'versao' => '3.0.0',

    /**
     * Padrão empresa
     */
    'uf'  => 'SC',
    'cep' => '89160314',
    'cnpj' => '14619408000150',

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
    'operacoes' => [5102, 5405, 6102, 6108, 6910],
    'devolucao' => [1202, 2202, 1411],

    'venda_externa' => 6108,
    'venda_interna' => 5102,

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
            'token'   => 'LG1445362480868R-803354070',
            'url'     => 'http://api.anymarket.com.br/v2',
        ]
    ],

    /**
     * Dados padrões da Nfe
     */
    'nfe' => [
        'config' => [
            'atualizacao'        => '2016-06-17 11:02:00',
            'tpAmb'              => '2',
            'pathXmlUrlFileNFe'  => 'nfe_ws3_mod55.xml',
            'pathXmlUrlFileCTe'  => 'cte_ws2.xml',
            'pathXmlUrlFileMDFe' => 'mdfe_ws1.xml',
            'pathXmlUrlFileCLe'  => '',
            'pathXmlUrlFileNFSe' => '',
            'pathNFeFiles'       => storage_path('app/nfe/nfe'),
            'pathCTeFiles'       => storage_path('app/nfe/cte'),
            'pathMDFeFiles'      => storage_path('app/nfe/mdfe'),
            'pathCLeFiles'       => storage_path('app/nfe/cle'),
            'pathNFSeFiles'      => storage_path('app/nfe/nfse'),
            'pathCertsFiles'     => storage_path('app/nfe/certs/'),
            'siteUrl'            => 'http://localhost/dev/tucanov3/public/',
            'schemesNFe'         => 'PL_008h',
            'schemesCTe'         => 'PL_CTe_200',
            'schemesMDFe'        => 'PL_MDFe_100',
            'schemesCLe'         => '',
            'schemesNFSe'        => '',
            'razaosocial'        => 'CARIOCA CELULARES ON-LINE LTDA ME',
            'siglaUF'            => 'SC',
            'cnpj'               => '14619408000150',
            'tokenIBPT'          => '',
            'tokenNFCe'          => '',
            'tokenNFCeId'        => '',
            'certPfxName'        => 'certificado2016.pfx',
            'certPassword'       => 'CARIOCA2016',
            'certPhrase'         => '',
            'aDocFormat'         => [
                'format'       => 'P',
                'paper'        => 'A4',
                'southpaw'     => '1',
                'pathLogoFile' => public_path('assets/img/carioca.png'),
                'logoPosition' => 'L',
                'font'         => 'Times',
                'printer'      => ''
            ],
            'aMailConf'  => [
                'mailAuth'         => '1',
                'mailFrom'         => 'roberto@myapp.local',
                'mailSmtp'         => 'smtp.myapp.local',
                'mailUser'         => 'roberto@myapp.local',
                'mailPass'         => 'heslo$',
                'mailProtocol'     => 'ssl',
                'mailPort'         => '587',
                'mailFromMail'     => null,
                'mailFromName'     => null,
                'mailReplayToMail' => null,
                'mailReplayToName' => null,
                'mailImapHost'     => null,
                'mailImapPort'     => null,
                'mailImapSecurity' => null,
                'mailImapNocerts'  => null,
                'mailImapBox'      => null
            ],
            'aProxyConf' => [
                'proxyIp' => '',
                'proxyPort' => '',
                'proxyUser' => '',
                'proxyPass' => ''
            ],
        ],
        'versao' => '3.10',

        // Valores padrão
        'default' => [
            'cUF' => 42,

            // Venda
            'venda' => [
                'natOp'    => 'VENDA DE MERCADORIA ADQUIRIDA OU RECEBIDA DE TERC',
                'indPag'   => 0,
                'mod'      => 55,
                'tpNf'     => 1,
                'cMunFG'   => '4214805',
                'tpImp'    => 1,
                'tpEmis'   => 1,
                'finNFe'   => 1,
                'indFinal' => 1,
                'indPres'  => 2,
                'procEmi'  => 0,
            ],

            // Devolução
            'devolucao' => [],

            // Dados do emitente
            'emitente' => [
                'CNPJ'  => '14619408000150',
                'xNome' => 'CARIOCA CELULARES ON-LINE LTDA ME',
                'xFant' => 'CARIOCA ON-LINE',
                'IE'    => '257538828',
                'IM'    => '3370',
                'CNAE'  => '4752100',
                'CRT'   => '3',
                'enderEmit' => [
                    'xLgr'    => 'AVENIDA OSCAR BARCELOS',
                    'nro'     => '1876',
                    'xCpl'    => 'SALA 01',
                    'xBairro' => 'CENTRO',
                    'cMun'    => '4214805',
                    'xMun'    => 'RIO DO SUL',
                    'UF'      => 'SC',
                    'CEP'     => '89160314',
                    'cPais'   => '1058',
                    'xPais'   => 'Brasil',
                    'fone'    => '4735213280',
                ],
            ],
        ],
    ],
];
