<?php

/**
 * Format date as timestamp
 *
 * @param $data
 * @return int
 */
function dataToTimestamp($data)
{
    $ano = substr($data, 6, 4);
    $mes = substr($data, 3, 2);
    $dia = substr($data, 0, 2);
    return mktime(0, 0, 0, $mes, $dia, $ano);
}

/**
 * Sum 1 day to timestamp
 *
 * @param $data
 * @return bool|string
 */
function Soma1dia($data)
{
    $datetime = DateTime::createFromFormat('d/m/Y', $data);
    date_add($datetime, date_interval_create_from_date_string('1 days'));
    return date_format($datetime, 'd/m/Y');
}

/**
 * Sum util days to the date
 *
 * @param $xDataInicial
 * @param $xSomarDias
 * @return bool|string
 */
function SomaDiasUteis($xDataInicial, $xSomarDias)
{
    $feriados = \Config::get('core.feriados');

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
    $feriados = \Config::get('core.feriados');

    $inicio = DateTime::createFromFormat('d/m/Y', $dataInicial);
    $final  = DateTime::createFromFormat('d/m/Y', $dataFinal);

    $diasTotal = $final->diff($inicio)->days + 1;
    $period = new DatePeriod($inicio, new DateInterval('P1D'), $final);

    $diasMes = [];
    foreach ($period as $datePeriod) {
        if (in_array($datePeriod->format('d/m'), $feriados)) {
            $diasTotal--;
        } elseif (in_array($datePeriod->format('w'), ['0', '6'])) {
            $diasTotal--;
        } elseif ($apenasPerido == false) {
            if (array_key_exists($datePeriod->format('n'), $diasMes)) {
                $diasMes[$datePeriod->format('n')]++;
            } else {
                $diasMes[$datePeriod->format('n')] = 1;
            }
        }
    }

    if ($apenasPerido) {
        return $diasTotal;
    } else {
        return ['total' => $diasTotal, 'mes' => $diasMes];
    }
}

/**
 * Coverts a date format with Carbon
 *
 * @param  string $date date to convert
 * @param  string $from from format
 * @param  string $to   to format
 * @return string       formated date
 */
function dateConvert($date = null, $from = 'Y-m-d H:i:s', $to = 'd/m/Y H:i')
{
  if (!$date) {
      return null;
  }

  return \Carbon\Carbon::createFromFormat($from, $date)->format($to);
}

/**
 * Return the date difference for humans
 * @param  string $date date to check difference
 * @param  string $from from format
 * @return string       formated date diff for humans
 */
function diffForHumans($date = null, $from = 'Y-m-d H:i:s')
{
    if (!$date) return null;

    \Carbon\Carbon::setLocale(config('app.locale'));

    return \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date)->diffForHumans();
}

/**
 * Return array of the last x months
 *
 * @param  integer $number
 * @return array
 */
function lastMonthsAsArray($number = 6)
{
    $months = [];
    for ($i = 5; $i >= 0; $i--) {
        $months[] = \Carbon\Carbon::now()->subMonths($i)->month;
    }

    return $months;
}
