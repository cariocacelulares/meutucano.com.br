<?php namespace Core\Transformers;

use Core\Transformers\Traits\TransformerTrait;

/**
 * Class PedidoTransformer
 * @package Core\Transformers
 */
class PedidoTransformer
{
    use TransformerTrait;

    public static function list($orders)
    {
        $obj = new PedidoTransformer;

        $pagination  = $orders->toArray();
        $transformed = [];

        foreach ($orders as $order) {
            $transformed[] = [
                'id'                   => $order['id'],
                'codigo_marketplace'   => $order['codigo_marketplace'],
                'marketplace_readable' => $obj->getMarketplaceReadable($order['marketplace']),
                'cliente'              => [
                    'nome' => $order['cliente']['nome'],
                    'fone' => $order['cliente']['fone'],
                ],
                'endereco'             => [
                    'cep'          => $order['endereco']['cep'],
                    'cep_readable' => $obj->getCepReadable($order['endereco']['cep']),
                    'cidade'       => $order['endereco']['cidade'],
                    'uf'           => $order['endereco']['uf'],
                ],
                'status'             => $order['status'],
                'total'              => $order['total'],
                'created_at'         => $obj->dateConvert($order['created_at']),
                'status_description' => $obj->getStatusDescription($order['status']),
                'reembolso'          => $order['reembolso'],
                'segurado'           => $order['segurado'],
                'protocolo'          => $order['protocolo'],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    public static function show($order)
    {
        $rastreios = [];
        foreach ($order->rastreios as $rastreio) {
            $devolucao = (!$rastreio->devolucao) ? null : [
                'id'         => $rastreio->devolucao->id,
                'data'       => $rastreio->devolucao->data,
                'created_at' => $rastreio->devolucao->created_at,
            ];

            $logistica = (!$rastreio->logistica) ? null : [
                'created_at' => $rastreio->logistica->created_at,
            ];

            $pi = (!$rastreio->pi) ? null : [
                'created_at'         => $rastreio->pi->created_at,
                'codigo_pi'          => $rastreio->pi->codigo_pi,
                'motivo'             => $rastreio->pi->motivo,
                'motivo_description' => $rastreio->pi->motivo_description,
            ];

            $rastreios[] = [
                'id'                  => $rastreio->id,
                'rastreio_url'        => $rastreio->rastreio_url,
                'rastreio'            => $rastreio->rastreio,
                'imagem_historico'    => $rastreio->imagem_historico,
                'monitorado'          => $rastreio->monitorado,
                'status'              => $rastreio->status,
                'status_description'  => $rastreio->status_description,
                'data_envio_readable' => $rastreio->data_envio_readable,
                'prazo'               => $rastreio->prazo,
                'devolucao'           => $devolucao,
                'logistica'           => $logistica,
                'pi'                  => $pi,
            ];
        }

        $notas = [];
        foreach ($order->notas as $nota) {
            $devolucao = (!$nota->devolucao) ? null : [
                'id'   => $nota->devolucao->id,
                'data' => $nota->devolucao->data,
            ];

            $notas[] = [
                'id'        => $nota->id,
                'data'      => $nota->data,
                'numero'    => $nota->numero,
                'serie'     => $nota->serie,
                'devolucao' => $devolucao,
            ];
        }

        $produtos = [];
        foreach ($order->produtos as $produto) {
            $inspecoes = [];
            foreach ($produto->inspecoes as $inspecao) {
                $inspecoes[] = [
                    'id'          => $inspecao->id,
                    'revisado_at' => $inspecao->revisado_at,
                    'priorizado'  => $inspecao->priorizado,
                ];
            }

            $produtos[] = [
                'produto_sku' => $produto->produto_sku,
                'id'          => $produto->id,
                'imei'        => $produto->imei,
                'quantidade'  => $produto->quantidade,
                'valor'       => $produto->valor,
                'produto'     => [
                    'titulo' => $produto->produto->titulo,
                    'estado' => $produto->produto->estado,
                ],
                'inspecoes'   => $inspecoes,
            ];
        }

        return [
            'id'                        => $order->id,
            'codigo_marketplace'        => $order->codigo_marketplace,
            'priorizado'                => $order->priorizado,
            'segurado'                  => $order->segurado,
            'reembolso'                 => $order->reembolso,
            'protocolo'                 => $order->protocolo,
            'status'                    => $order->status,
            'status_description'        => $order->status_description,
            'can_prioritize'            => $order->can_prioritize,
            'can_hold'                  => $order->can_hold,
            'can_cancel'                => $order->can_cancel,
            'marketplace_readable'      => $order->marketplace_readable,
            'frete_metodo_readable'     => $order->frete_metodo_readable,
            'frete_valor'               => $order->frete_valor,
            'total'                     => $order->total,
            'pagamento_metodo_readable' => $order->pagamento_metodo_readable,
            'created_at'                => $order->created_at,
            'desconto'                  => $order->desconto,

            'endereco'                  => [
                'id'           => $order->endereco->id,
                'rua'          => $order->endereco->rua,
                'numero'       => $order->endereco->numero,
                'bairro'       => $order->endereco->bairro,
                'cidade'       => $order->endereco->cidade,
                'uf'           => $order->endereco->uf,
                'cep'          => $order->endereco->cep,
                'cep_readable' => $order->endereco->cep_readable,
                'complemento'  => $order->endereco->complemento,
            ],

            'cliente'                   => [
                'id'              => $order->cliente->id,
                'nome'            => $order->cliente->nome,
                'fone'            => $order->cliente->fone,
                'email'           => $order->cliente->email,
                'taxvat'          => $order->cliente->taxvat,
                'taxvat_readable' => $order->cliente->taxvat_readable,
            ],

            'rastreios'                 => $rastreios,
            'notas'                     => $notas,
            'produtos'                  => $produtos,
        ];
    }

    protected function getStatusDescription($status)
    {
        if (!isset(\Config::get('core.pedido_status')[$status])) {
            return 'Desconhecido';
        } else {
            return \Config::get('core.pedido_status')[$status];
        }
    }

    protected function getMarketplaceReadable($marketplace)
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

    protected function getPagamentoMetodoReadable($pagamento_metodo)
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

    protected function getFreteMetodoReadable($frete_metodo)
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

    protected function getCanHold($status)
    {
        if (in_array($status, [0,1])) {
            return true;
        }

        return false;
    }

    protected function getCanPrioritize($status)
    {
        if (in_array($status, [0,1])) {
            return true;
        }

        return false;
    }

    protected function getCanCancel($status)
    {
        if (in_array($status, [0,1])) {
            return true;
        }

        return false;
    }

    protected function getDesconto($order)
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
