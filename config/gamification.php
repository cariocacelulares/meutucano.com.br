<?php
$nivel_constante = 0.05;

return [
    'ativo' => env('GAMIFICATION_ATIVO', true),
    'votos_mes' => 1,
    'nivel_constante' => $nivel_constante,
    'nivel' => function($experiencia) use ($nivel_constante) {
        return (int)($nivel_constante * sqrt($experiencia));
    },
    'nivel_exp' => function($nivel) use ($nivel_constante) {
        return pow(($nivel/$nivel_constante), 2);
    }
];