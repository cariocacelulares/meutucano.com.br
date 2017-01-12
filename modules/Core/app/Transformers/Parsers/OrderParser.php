<?php namespace Core\Transformers\Parsers;

/**
 * Class OrderParser
 * @package Core\Transformers\Parsers
 */
class OrderParser
{
    /**
     * Transform order status code to string
     *
     * @param  int|string $status
     * @return string
     */
    public static function getStatusDescription($status)
    {
        if (!isset(\Config::get('core.pedido_status')[$status])) {
            return 'Desconhecido';
        } else {
            return \Config::get('core.pedido_status')[$status];
        }
    }

    /**
     * Transform marketplace raw to beauty string :)
     *
     * @param  string $marketplace
     * @return string
     */
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

    /**
     * Transforme payment method raw to beauty string
     *
     * @param  string $pagamento_metodo
     * @return string
     */
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

    /**
     * Transform shipment method war to beauty string
     *
     * @param  string $frete_metodo
     * @return string
     */
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
}
