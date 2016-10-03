<?php

return [
    'votos_mes' => 1,
    'level_constant' => 0.05,

    // Vá até o fim do arquivo para visualizar o gerador de xp, você deve regerar caso a constant mude
    'levels' => [
        1 => 400,
        2 => 1600,
        3 => 3600,
        4 => 6400,
        5 => 10000,
        6 => 14400,
        7 => 19600,
        8 => 25600,
        9 => 32400,
        10 => 40000,
        11 => 48400,
        12 => 57600,
        13 => 67600,
        14 => 78400,
        15 => 90000,
        16 => 102400,
        17 => 115600,
        18 => 129600,
        19 => 144400,
        20 => 160000,
        21 => 176400,
        22 => 193600,
        23 => 211600,
        24 => 230400,
        25 => 250000,
    ],
];

/*
$levels = [];
$i = 0;
while (true) {
    $i += 10;

    $new = (int)(.05 * sqrt($i));
    if ($new != array_search(end($levels), $levels)) {
        $levels[$new] = $i;
    }

    if ($new >= 25)
        break;
}

echo "'levels' => [<br/>";
foreach ($levels as $level => $xp) {
    echo "{$level} => {$xp}, <br/>";
}
echo '],';
*/