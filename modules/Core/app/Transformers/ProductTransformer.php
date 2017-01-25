<?php namespace Core\Transformers;

use Core\Transformers\Parsers\ProductParser;
use Core\Transformers\Parsers\OrderParser;

/**
 * Class ProductTransformer
 * @package Core\Transformers
 */
class ProductTransformer
{
    /**
     * @param  object $products
     * @return array
     */
    public static function search($products)
    {
        $transformed = [];

        foreach ($products as $product) {
            $transformed[] = [
                'sku'                => $product['sku'],
                'titulo'             => $product['titulo'],
                'estoque'            => $product['estoque'],
                'estado'             => $product['estado'],
                'estado_description' => ProductParser::getEstadoDescription($product['estado']),
                'ean'                => $product['ean'],
                'referencia'         => $product['referencia'],
            ];
        }

        return $transformed;
    }

    /**
     * @param  object $products
     * @return array
     */
    public static function list($products)
    {
        $pagination  = $products->toArray();
        $transformed = [];

        foreach ($products as $product) {
            $transformed[] = [
                'sku'                => $product['sku'],
                'titulo'             => $product['titulo'],
                'linha'              => $product['linha'],
                'marca'              => $product['marca'],
                'estoque'            => $product['estoque'],
                'estado'             => $product['estado'],
                'estado_description' => ProductParser::getEstadoDescription($product['estado']),
                'attachedProducts'   => $product['attachedProducts'],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $product
     * @return array
     */
    public static function show($product)
    {
        $inspecoesTecnicas = [];
        foreach ($product->inspecoesTecnicas as $inspecaoTecnica) {
            $inspecoesTecnicas[] = [
                'id' => $inspecaoTecnica->id
            ];
        }

        $attachedProducts = [];
        foreach ($product->pedidoProdutos as $pedidoProduto) {
            if (!isset($attachedProducts[$pedidoProduto['status']])) {
                $attachedProducts[$pedidoProduto['status']] = 1;
            } else {
                $attachedProducts[$pedidoProduto['status']]++;
            }

            $attachedProducts['data'][] = [
                'id'                 => $pedidoProduto['pedido']['id'],
                'status'             => $pedidoProduto['pedido']['status'],
                'status_description' => OrderParser::getStatusDescription($pedidoProduto['pedido']['status']),
                'codigo_marketplace' => $pedidoProduto['pedido']['codigo_marketplace'],
                'marketplace'        => $pedidoProduto['pedido']['marketplace'],
                // 'quantidade'         => $pedidoProduto['quantidade'],
                'valor'              => $pedidoProduto['valor'],
            ];
        }

        return [
            'sku'              => $product->sku,
            'unidade'          => $product->unidade,
            'ativo'            => $product->ativo,
            'estado'           => $product->estado,
            'sku'              => $product->sku,
            'ncm'              => $product->ncm,
            'titulo'           => $product->titulo,
            'estoque'          => $product->estoque,
            'revisoes'         => $inspecoesTecnicas,
            'attachedProducts' => $attachedProducts,
        ];
    }
}
