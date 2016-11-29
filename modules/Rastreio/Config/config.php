<?php

return [
    'name' => 'Rastreio',
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
];
