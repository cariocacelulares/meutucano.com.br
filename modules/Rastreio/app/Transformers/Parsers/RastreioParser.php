<?php namespace Rastreio\Transformers\Parsers;

/**
 * Class RastreioParser
 * @package Rastreio\Transformers\Parsers
 */
class RastreioParser
{
    public static function getStatusDescription($status)
    {
       return ($status > 0) ? \Config::get('rastreio.status')[$status] : 'Pendente';
    }

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

    public static function getPrazoDate($data_envio, $prazo)
    {
        return SomaDiasUteis(dateConvert($data_envio, 'Y-m-d'), $prazo);
    }

    public static function getRastreioUrl($rastreio)
    {
        return "http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS={$rastreio}";
    }

    public static function getMonitorado($order)
    {
        return !!$order->monitoramentos()->where('usuario_id', '=', getCurrentUserId())->first();
    }

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
