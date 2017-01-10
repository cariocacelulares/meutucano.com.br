<?php namespace Core\Transformers;

use Rastreio\Transformers\Parsers\RastreioParser;
use Rastreio\Transformers\Parsers\PiParser;
use Rastreio\Transformers\Parsers\DevolucaoParser;
use Core\Transformers\Parsers\OrderParser;
use Core\Transformers\Parsers\ClientParser;
use Core\Transformers\Parsers\AddressParser;

/**
 * Class OrderTransformer
 * @package Core\Transformers
 */
class OrderTransformer
{
    /**
     * @param  object $orders
     * @return array
     */
    public static function faturamento($orders)
    {
        $pagination  = $orders->toArray();
        $transformed = [];

        foreach ($orders as $order) {
            $produtos = [];
            foreach ($order->produtos as $orderProduct) {
                $produtos[] = [
                    'id'          => $orderProduct->id,
                    'produto_sku' => $orderProduct->produto_sku,
                    'quantidade'  => $orderProduct->quantidade,
                    'valor'       => $orderProduct->valor,
                    'produto'     => [
                        'sku'    => $orderProduct->produto->sku,
                        'titulo' => $orderProduct->produto->titulo,
                    ],
                    'inspecoes'   => $orderProduct->inspecoes,
                ];
            }

            $transformed[] = [
                'id'                   => $order['id'],
                'codigo_marketplace'   => $order['codigo_marketplace'],
                'marketplace'          => $order['marketplace'],
                'marketplace_readable' => OrderParser::getMarketplaceReadable($order['marketplace']),
                'segurado'             => $order['segurado'],
                'priorizado'           => $order['priorizado'],
                'desconto'             => OrderParser::getDesconto($order),
                'estimated_delivery'   => dateConvert($order['estimated_delivery'], 'Y-m-d', 'd/m/Y'),
                'created_at'           => dateConvert($order['created_at']),
                'comentarios'          => $order['comentarios'],
                'notas'                => $order['notas'],
                'rastreios'            => $order['rastreios'],
                'frete_metodo'         => $order['frete_metodo'],
                'endereco'             => [
                    'id' => $order['endereco']['id'],
                    'uf' => $order['endereco']['uf'],
                ],
                'cliente'              => [
                    'nome'            => $order['cliente']['nome'],
                    'taxvat'          => $order['cliente']['taxvat'],
                    'taxvat_readable' => ClientParser::getTaxvatReadable($order['cliente']['taxvat'], $order['cliente']['tipo']),
                ],
                'produtos'             => $produtos,
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $orders
     * @return array
     */
    public static function search($orders)
    {
        $transformed = [];

        foreach ($orders as $order) {
            $rastreios = [];
            foreach ($order['rastreios'] as $rastreio) {
                $devolucao = (!$rastreio->devolucao) ? null : [
                    'id'         => $rastreio->devolucao->id,
                    'data'       => dateConvert($rastreio->devolucao->data, 'Y-m-d', 'd/m/Y'),
                    'created_at' => dateConvert($rastreio->devolucao->created_at),
                ];

                $logistica = (!$rastreio->logistica) ? null : [
                    'id'         => $rastreio->logistica->id,
                    'created_at' => dateConvert($rastreio->logistica->created_at),
                ];

                $pi = (!$rastreio->pi) ? null : [
                    'id'         => $rastreio->pi->id,
                    'created_at' => dateConvert($rastreio->pi->created_at),
                ];

                $rastreios[] = [
                    'id'                 => $rastreio->id,
                    'rastreio_url'       => RastreioParser::getRastreioUrl($rastreio->rastreio),
                    'rastreio'           => $rastreio->rastreio,
                    'status'             => $rastreio->status,
                    'status_description' => RastreioParser::getStatusDescription($rastreio->status),
                    'created_at'         => dateConvert($rastreio->created_at),
                    'devolucao'          => $devolucao,
                    'logistica'          => $logistica,
                    'pi'                 => $pi,
                ];
            }

            $transformed[] = [
                'id'                   => $order->id,
                'codigo_api'           => $order->codigo_api,
                'codigo_marketplace'   => $order->codigo_marketplace,
                'marketplace_readable' => OrderParser::getMarketplaceReadable($order->marketplace),
                'status'               => $order->status,
                'status_description'   => OrderParser::getStatusDescription($order->status),
                'reembolso'            => $order->reembolso,
                'segurado'             => $order->segurado,
                'protocolo'            => $order->protocolo,
                'rastreios'            => $rastreios,
                'cliente'              => [
                    'nome' => $order->cliente->nome,
                ],
            ];
        }

        return $transformed;
    }

    /**
     * @param  object $orders
     * @return array
     */
    public static function list($orders)
    {
        $pagination  = $orders->toArray();
        $transformed = [];

        foreach ($orders as $order) {
            $transformed[] = [
                'id'                   => $order['id'],
                'codigo_marketplace'   => $order['codigo_marketplace'],
                'marketplace_readable' => OrderParser::getMarketplaceReadable($order['marketplace']),
                'status'             => $order['status'],
                'total'              => $order['total'],
                'created_at'         => dateConvert($order['created_at']),
                'status_description' => OrderParser::getStatusDescription($order['status']),
                'reembolso'          => $order['reembolso'],
                'segurado'           => $order['segurado'],
                'protocolo'          => $order['protocolo'],
                'cliente'              => [
                    'nome' => $order['cliente']['nome'],
                    'fone' => $order['cliente']['fone'],
                ],
                'endereco'             => [
                    'cep'          => $order['endereco']['cep'],
                    'cep_readable' => AddressParser::getCepReadable($order['endereco']['cep']),
                    'cidade'       => $order['endereco']['cidade'],
                    'uf'           => $order['endereco']['uf'],
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $order
     * @return array
     */
    public static function show($order)
    {
        $rastreios = [];
        foreach ($order->rastreios as $rastreio) {
            $devolucao = (!$rastreio->devolucao) ? null : [
                'id'         => $rastreio->devolucao->id,
                'data'       => dateConvert($rastreio->devolucao->data, 'Y-m-d', 'd/m/Y'),
                'created_at' => dateConvert($rastreio->devolucao->created_at),
            ];

            $logistica = (!$rastreio->logistica) ? null : [
                'created_at' => dateConvert($rastreio->logistica->created_at),
            ];

            $pi = (!$rastreio->pi) ? null : [
                'created_at'         => dateConvert($rastreio->pi->created_at),
                'codigo_pi'          => $rastreio->pi->codigo_pi,
                'motivo'             => $rastreio->pi->motivo_status,
                'motivo_description' => PiParser::getMotivoDescription($rastreio->pi->motivo_status),
            ];

            $rastreios[] = [
                'id'                  => $rastreio->id,
                'rastreio'            => $rastreio->rastreio,
                'rastreio_url'        => RastreioParser::getRastreioUrl($rastreio->rastreio),
                'imagem_historico'    => $rastreio->imagem_historico,
                'monitorado'          => RastreioParser::getMonitorado($rastreio),
                'status'              => $rastreio->status,
                'status_description'  => RastreioParser::getStatusDescription($rastreio->status),
                'data_envio_readable' => dateConvert($rastreio->data_envio, 'Y-m-d', 'd/m/Y'),
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
                'data' => dateConvert($nota->devolucao->data, 'Y-m-d', 'd/m/Y'),
            ];

            $notas[] = [
                'id'        => $nota->id,
                'data'      => dateConvert($nota->data, 'Y-m-d', 'd/m/Y'),
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
                    'revisado_at' => dateConvert($inspecao->revisado_at),
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
            'status_description'        => OrderParser::getStatusDescription($order->status),
            'can_prioritize'            => OrderParser::getCanPrioritize($order->status),
            'can_hold'                  => OrderParser::getCanHold($order->status),
            'can_cancel'                => OrderParser::getCanCancel($order->status),
            'marketplace'               => $order->marketplace,
            'marketplace_readable'      => OrderParser::getMarketplaceReadable($order->marketplace),
            'frete_metodo_readable'     => OrderParser::getFreteMetodoReadable($order->frete_metodo),
            'frete_valor'               => $order->frete_valor,
            'total'                     => $order->total,
            'pagamento_metodo_readable' => OrderParser::getPagamentoMetodoReadable($order->pagamento_metodo),
            'created_at'                => dateConvert($order->created_at),
            'desconto'                  => OrderParser::getDesconto($order),

            'endereco'                  => [
                'id'           => $order->endereco->id,
                'rua'          => $order->endereco->rua,
                'numero'       => $order->endereco->numero,
                'bairro'       => $order->endereco->bairro,
                'cidade'       => $order->endereco->cidade,
                'uf'           => $order->endereco->uf,
                'cep'          => $order->endereco->cep,
                'cep_readable' => AddressParser::getCepReadable($order->endereco->cep),
                'complemento'  => $order->endereco->complemento,
            ],

            'cliente'                   => [
                'id'              => $order->cliente->id,
                'nome'            => $order->cliente->nome,
                'fone'            => $order->cliente->fone,
                'email'           => $order->cliente->email,
                'taxvat'          => $order->cliente->taxvat,
                'taxvat_readable' => ClientParser::getTaxvatReadable($order->cliente->taxvat, $order->cliente->tipo),
            ],

            'rastreios'                 => $rastreios,
            'notas'                     => $notas,
            'produtos'                  => $produtos,
        ];
    }
}
