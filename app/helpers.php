<?php

if (!function_exists('logMessage')) {
    /**
     * Retorna a mensagem de log formatada
     *
     * @param $data
     * @return int
     */
    function logMessage($exception, $message = 'Erro'){
        return sprintf("%s
            Arquivo: %s
            Linha: %s
            Mensagem: %s
            ------------------------
            %s
        ",
            $message,
            $exception->getFile(),
            $exception->getLine(),
            $exception->getMessage(),
            $exception->getTraceAsString()
        );
    }
}

if (!function_exists('dataToTimestamp')) {
    /**
     * Format date as timestamp
     *
     * @param $data
     * @return int
     */
    function dataToTimestamp($data){
        $ano = substr($data, 6,4);
        $mes = substr($data, 3,2);
        $dia = substr($data, 0,2);
        return mktime(0, 0, 0, $mes, $dia, $ano);
    }
}

if (!function_exists('Soma1dia')) {
    /**
     * Sum 1 day to timestamp
     *
     * @param $data
     * @return bool|string
     */
    function Soma1dia($data){
        $datetime = DateTime::createFromFormat('d/m/Y', $data);
        date_add($datetime, date_interval_create_from_date_string('1 days'));
        return date_format($datetime, 'd/m/Y');
    }
}

if (!function_exists('SomaDiasUteis')) {
    /**
     * Sum util days to the date
     *
     * @param $xDataInicial
     * @param $xSomarDias
     * @return bool|string
     */
    function SomaDiasUteis($xDataInicial, $xSomarDias)
    {
        $feriados = \Config::get('tucano.feriados');

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

if (!function_exists('diasUteisPeriodo')) {
    /**
     * Sum util days to the date
     *
     * @param $dataInicial
     * @param $dataFinal
     * @param bool $apenasPerido
     * @return bool|string
     */
    function diasUteisPeriodo($dataInicial, $dataFinal, $apenasPerido = false)
    {
        $feriados = \Config::get('tucano.feriados');

        $inicio = DateTime::createFromFormat('d/m/Y', $dataInicial);
        $final  = DateTime::createFromFormat('d/m/Y', $dataFinal);

        $diasTotal = $final->diff($inicio)->days + 1;
        $period = new DatePeriod($inicio, new DateInterval('P1D'), $final);

        $diasMes = [];
        foreach ($period as $datePeriod) {
            if (in_array($datePeriod->format('d/m'), $feriados)) {
                $diasTotal--;
            } else if (in_array($datePeriod->format('w'), ['0', '6'])) {
                $diasTotal--;
            } else if ($apenasPerido == false) {
                if (array_key_exists($datePeriod->format('n'), $diasMes))
                    $diasMes[$datePeriod->format('n')]++;
                else
                    $diasMes[$datePeriod->format('n')] = 1;
            }
        }

        if ($apenasPerido) {
            return $diasTotal;
        } else {
            return ['total' => $diasTotal, 'mes' => $diasMes];
        }
    }
}