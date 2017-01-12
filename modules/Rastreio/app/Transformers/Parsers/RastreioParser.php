<?php namespace Rastreio\Transformers\Parsers;

/**
 * Class RastreioParser
 * @package Rastreio\Transformers\Parsers
 */
class RastreioParser
{
    /**
     * Transform status code to string description
     *
     * @param  int|string $status
     * @return string
     */
    public static function getStatusDescription($status)
    {
       return ($status > 0) ? \Config::get('rastreio.status')[$status] : 'Pendente';
    }

    /**
     * Transform type code to string description
     *
     * @param  int|string $tipo
     * @return string
     */
    public static function getTipoDescription($tipo)
    {
        switch ((int) $tipo) {
            case 1:
                return 'Devolução';
            case 2:
                return 'Reenvio por extravio';
            case 3:
                return 'Logística reversa';
            default:
                return 'Padrão';
        }
    }

    /**
     * Calc deadline date by send date and deadline days
     *
     * @param  date $data_envio
     * @param  int $prazo
     * @return date
     */
    public static function getPrazoDate($data_envio, $prazo)
    {
        return SomaDiasUteis(dateConvert($data_envio, 'Y-m-d', 'd/m/Y'), $prazo);
    }

    /**
     * Retorna o link do rastreio nos correios
     *
     * @param  string $rastreio codigo de rastreio
     * @return string           url
     */
    public static function getRastreioUrl($rastreio)
    {
        return "http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS={$rastreio}";
    }

    /**
     * If is monitored by current user
     *
     * @param  rastreio $rastreio
     * @return boolean
     */
    public static function getMonitorado($rastreio)
    {
        return !!$rastreio->monitoramentos()->where('usuario_id', '=', getCurrentUserId())->first();
    }

    /**
     * Return rastreio protocolo by [pi, devolucao, logistica]
     *
     * @param  object $obj
     * @return string|null
     */
    public static function getProtocolo($obj)
    {
        if ((int) $obj->acao === 1) {
            try {
                return $obj->rastreio->pedido->protocolo ?: null;
            } catch (\Exception $e) {
            }
        }

        return null;
    }

    /**
     * Return cancel image by [pi, devolucao, logistica]
     *
     * @param  object $obj
     * @return string|null
     */
    public static function getImagemCancelamento($obj)
    {
        if ((int) $obj->acao === 1) {
            try {
                return $obj->rastreio->pedido->imagem_cancelamento ?: null;
            } catch (\Exception $e) {
            }
        }

        return null;
    }
}
