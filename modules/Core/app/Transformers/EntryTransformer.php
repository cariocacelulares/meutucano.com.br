<?php namespace Core\Transformers;

/**
 * Class EntryTransformer
 * @package Core\Transformers
 */
class EntryTransformer
{
    /**
     * @param  object $entry
     * @return array
     */
    public static function show($entry)
    {
        $products = [];
        foreach ($entry->products as $product) {
            $stocks = [];
            foreach ($product->product->productStocks as $productStock) {
                $stocks[] = [
                    'id'             => $productStock->id,
                    'serial_enabled' => $productStock->serial_enabled,
                    'stock'          => [
                        'slug'  => $productStock->stock->slug,
                        'title' => $productStock->stock->title,
                    ]
                ];
            }

            $products[] = [
                'ean'                        => $product->ean,
                'ncm'                        => $product->ncm,
                'title'                      => $product->title,
                'id'                         => $product->id,
                'stock_entry_id'             => $product->stock_entry_id,
                'product_sku'                => $product->product_sku,
                'product_stock_id'           => $product->product_stock_id,
                'quantity'                   => $product->quantity,
                'unitary_value'              => $product->unitary_value,
                'total_value'                => $product->total_value,
                'icms'                       => $product->icms,
                'ipi'                        => $product->ipi,
                'pis'                        => $product->pis,
                'cofins'                     => $product->cofins,
                'imeis'                      => $product->imeis,
                'product'                    => [
                    'sku'   => $product->product->sku,
                    'title' => $product->product->title,
                    'ean'   => $product->product->ean,
                    'ncm'   => $product->product->ncm,
                ],
                'stocks'                     => $stocks,
                'stock'                      => [
                    'id'             => $product->productStock->id,
                    'serial_enabled' => $product->productStock->serial_enabled,
                    'stock'          => [
                        'slug'  => $product->productStock->stock->slug,
                        'title' => $product->productStock->stock->title,
                    ],
                ]
            ];
        }

        return [
            'id'           => $entry->id,
            'user_id'      => $entry->user_id,
            'supplier_id'  => $entry->supplier_id,
            'description'  => $entry->description,
            'created_at'   => dateConvert($entry->created_at),
            'confirmed_at' => !is_null($entry->confirmed_at) ? dateConvert($entry->confirmed_at) : null,
            'supplier'     => [
                'id'           => $entry->supplier->id,
                'company_name' => $entry->supplier->company_name,
                'name'         => $entry->supplier->name,
                'cnpj'         => $entry->supplier->cnpj,
                'ie'           => $entry->supplier->ie,
                'crt'          => $entry->supplier->crt,
                'fone'         => $entry->supplier->fone,
                'street'       => $entry->supplier->street,
                'number'       => $entry->supplier->number,
                'complement'   => $entry->supplier->complement,
                'neighborhood' => $entry->supplier->neighborhood,
                'city'         => $entry->supplier->city,
                'uf'           => $entry->supplier->uf,
                'cep'          => $entry->supplier->cep,
                'country'      => $entry->supplier->country,
            ],
            'user'         => [
                'id'   => $entry->user->id,
                'name' => $entry->user->name,
            ],
            'invoice'      => !$entry->invoice ? null : [
                'id'             => $entry->invoice->id,
                'stock_entry_id' => $entry->invoice->stock_entry_id,
                'key'            => $entry->invoice->key,
                'series'         => $entry->invoice->series,
                'number'         => $entry->invoice->number,
                'model'          => $entry->invoice->model,
                'cfop'           => $entry->invoice->cfop,
                'total'          => $entry->invoice->total,
                'file'           => $entry->invoice->file,
                'emission'       => dateConvert($entry->invoice->emission),
            ],
            'products'     => $products,
        ];
    }
}
