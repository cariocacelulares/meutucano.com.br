<?php namespace Core\Transformers;

use Core\Transformers\Parsers\ClientParser;
use Core\Transformers\Parsers\AddressParser;
use Core\Transformers\Parsers\OrderParser;

/**
 * Class SupplierTransformer
 * @package Core\Transformers
 */
class SupplierTransformer
{
    /**
     * @param  object $suppliers
     * @return array
     */
    public static function tableList($suppliers)
    {
        $pagination  = $suppliers->toArray();
        $transformed = [];

        foreach ($suppliers as $supplier) {
            $transformed[] = [
                'id'           => $supplier->id,
                'company_name' => $supplier->company_name,
                'name'         => $supplier->name,
                'cnpj'         => $supplier->cnpj,
                'ie'           => $supplier->ie,
                'fone'         => $supplier->fone,
                'city'         => $supplier->city,
                'uf'           => $supplier->uf,
                'cep'          => $supplier->cep,
                'country'      => $supplier->country,
                'created_at'   => dateConvert($supplier->created_at),
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
