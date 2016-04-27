<?php

/**
 * Define REST route
 *
 * @param $path
 * @param $controller
 */
if (!function_exists('rest')) {
    function rest($path, $controller)
    {
        Route::resource($path, $controller,
            ['except' => ['create', 'edit']]);
    }
}

/**
 * Format date as timestamp
 *
 * @param $data
 * @return int
 */
if (!function_exists('dataToTimestamp')) {
    function dataToTimestamp($data){
        $ano = substr($data, 6,4);
        $mes = substr($data, 3,2);
        $dia = substr($data, 0,2);
        return mktime(0, 0, 0, $mes, $dia, $ano);
    }
}

/**
 * Sum 1 day to timestamp
 *
 * @param $data
 * @return bool|string
 */
if (!function_exists('Soma1dia')) {
    function Soma1dia($data){
        $datetime = DateTime::createFromFormat('d/m/Y', $data);
        date_add($datetime, date_interval_create_from_date_string('1 days'));
        return date_format($datetime, 'd/m/Y');
    }
}

/**
 * Sum util days to the date
 *
 * @param $xDataInicial
 * @param $xSomarDias
 * @return bool|string
 */
if (!function_exists('SomaDiasUteis')) {
    function SomaDiasUteis($xDataInicial, $xSomarDias)
    {
        $dia = 86400;
        $datas = array();
        $datas['pascoa'] = easter_date(date('Y'));
        $datas['sexta_santa'] = $datas['pascoa'] - (2 * $dia);
        $datas['carnaval'] = $datas['pascoa'] - (46 * $dia);
        $datas['carnaval2'] = $datas['pascoa'] - (47 * $dia);
        $datas['corpus_cristi'] = $datas['pascoa'] + (60 * $dia);
        $feriados = [
            '01/01',
            '02/02',
            date('d/m', $datas['carnaval']),
            date('d/m', $datas['carnaval2']),
            date('d/m', $datas['sexta_santa']),
            date('d/m', $datas['pascoa']),
            '21/04',
            '01/05',
            date('d/m', $datas['corpus_cristi']),
            '07/09',
            '20/09',
            '12/10',
            '02/11',
            '15/11',
            '25/12'
        ];

        for ($j = 1; $j <= $xSomarDias; $j++) {
            $xDataInicial = Soma1dia($xDataInicial);

            if (date("w", dataToTimestamp($xDataInicial)) == "0") {
                $xSomarDias++;
            } elseif (date("w", dataToTimestamp($xDataInicial)) == "6") {
                $xSomarDias++;
            } elseif (in_array(date("d/m", dataToTimestamp($xDataInicial)), $feriados)) {
                $xSomarDias++;
            }
        }
        return $xDataInicial;
    }
}