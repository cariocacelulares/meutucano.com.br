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
                'sku'                => $product->sku,
                'titulo'             => $product->titulo,
                'estoque'            => $product->estoque,
                'estado'             => $product->estado,
                'estado_description' => ProductParser::getEstadoDescription($product->estado),
                'ean'                => $product->ean,
                'ncm'                => $product->ncm,
                'referencia'         => $product->referencia,
            ];
        }

        return $transformed;
    }

    /**
     * @param  object $products
     * @return array
     */
    public static function tableList($products)
    {
        $pagination  = $products->toArray();
        $transformed = [];

        foreach ($products as $product) {
            $transformed[] = [
                'sku'                => $product->sku,
                'titulo'             => $product->titulo,
                'linha'              => $product->linha,
                'marca'              => $product->marca,
                'estoque'            => $product->estoque,
                'valor'              => $product->valor,
                'cost'               => $product->getCost(),
                'estado'             => $product->estado,
                'estado_description' => ProductParser::getEstadoDescription($product->estado),
                'attachedProducts'   => $product->attachedProducts,
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
        return [
            'sku'                => $product->sku,
            'linha_id'           => $product->linha_id,
            'marca_id'           => $product->marca_id,
            'titulo'             => $product->titulo,
            'ean'                => $product->ean,
            'ncm'                => $product->ncm,
            'cost'               => $product->getCost(),
            'warranty'           => $product->warranty
            'valor'              => $product->valor,
            'estado'             => $product->estado,
            'estado_description' => ProductParser::getEstadoDescription($product->estado),
        ];
    }
}
