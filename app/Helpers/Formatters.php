<?php

/**
 * Retorna o numero sem ponto e com duas casas após ele
 *
 * @param  string $string
 * @return string
 */
function currencyNumbers($string)
{
    $dot = strpos($string, '.');
    $decimals = str_pad(substr($string, ($dot + 1), 2), 2, '0');
    return (int) (substr($string, 0, $dot) . $decimals);
}

/**
 * Retorna apenas os digitos de uma string
 *
 * @param  string $string
 * @return string
 */
function numbers($string)
{
    return preg_replace('/\D/', '', $string);
}

function removeAcentos($string)
{
    $map = array(
        'á' => 'a',
        'à' => 'a',
        'ã' => 'a',
        'â' => 'a',
        'é' => 'e',
        'ê' => 'e',
        'í' => 'i',
        'ó' => 'o',
        'ô' => 'o',
        'õ' => 'o',
        'ú' => 'u',
        'ü' => 'u',
        'ç' => 'c',
        'Á' => 'A',
        'À' => 'A',
        'Ã' => 'A',
        'Â' => 'A',
        'É' => 'E',
        'Ê' => 'E',
        'Í' => 'I',
        'Ó' => 'O',
        'Ô' => 'O',
        'Õ' => 'O',
        'Ú' => 'U',
        'Ü' => 'U',
        'Ç' => 'C'
    );

    return strtr($string, $map);
}

/**
 * Formata o ID do pedido no marketplace
 *
 * @param  string  $marketplace
 * @param  id      $pedidoId
 * @return string
 */
function parseMarketplaceId($marketplace, $pedidoId)
{
    if ($marketplace === 'B2W') {
        if (substr($pedidoId, 0, 1) !== '0') {
            $inicio = substr($pedidoId, 0, 2);

            if ($inicio === '10') {
                $inicioId = '01';
                $posSub   = 2;
            } else {
                $inicioId = '0' . substr($pedidoId, 0, 1);
                $posSub   = 1;
            }

            $fim = substr($pedidoId, $posSub, -2);

            return $inicioId . '-' . $fim;
        }
    } elseif ($marketplace === 'WALMART') {
        if (strpos($pedidoId, '-') > 0) {
            return substr($pedidoId, 0, strpos($pedidoId, '-'));
        }
    }

    return $pedidoId;
}
