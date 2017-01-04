<?php namespace Core\Transformers\Parsers;

/**
 * Class OrderParser
 * @package Core\Transformers\Parsers
 */
class OrderParser
{
    public static function getStatusDescription($status)
    {
        if (!isset(\Config::get('core.pedido_status')[$status])) {
            return 'Desconhecido';
        } else {
            return \Config::get('core.pedido_status')[$status];
        }
    }

    public static function getMarketplaceReadable($marketplace)
    {
        switch ($marketplace) {
            case 'WALMART':
                return 'Walmart';
            case 'MERCADOLIVRE':
                return 'Mercado Livre';
            default:
                return $marketplace;
        }
    }

    public static function getPagamentoMetodoReadable($pagamento_metodo)
    {
        $metodo = strtolower($pagamento_metodo);

        if (!$metodo) {
            return null;
        }

        switch ($metodo) {
            case 'credito':
                $metodo = 'cartão de crédito';
                break;
            case 'debito':
                $metodo = 'cartão de débito';
                break;
            case 'boleto':
                $metodo = 'boleto';
                break;
            default:
                $metodo = 'outro meio';
                break;
        }

        return 'Pagamento via ' . $metodo;
    }

    public static function getFreteMetodoReadable($frete_metodo)
    {
        $metodo = strtolower($frete_metodo);

        if (!$metodo) {
            return null;
        }

        switch ($metodo) {
            case 'pac':
                $metodo = 'PAC';
                break;
            case 'sedex':
                $metodo = 'SEDEX';
                break;
            default:
                $metodo = 'outro meio';
                break;
        }

        return 'Envio via ' . $metodo;
    }

    public static function getCanHold($status)
    {
        if (in_array($status, [0,1])) {
            return true;
        }

        return false;
    }

    public static function getCanPrioritize($status)
    {
        if (in_array($status, [0,1])) {
            return true;
        }

        return false;
    }

    public static function getCanCancel($status)
    {
        if (in_array($status, [0,1])) {
            return true;
        }

        return false;
    }

    public static function getDesconto($order)
    {
        if (strtolower($order->marketplace) === 'b2w') {
            $frete = ($order->frete_valor) ?: 0;
            $total = 0;
            foreach ($order->produtos as $produto) {
                $total += $produto->total;
            }

            if ($total > 0 && ($order->total - $frete) != $total) {
                return round(100 - ((($order->total - $frete) * 100) / $total));
            }
        }

        return null;
    }
}
