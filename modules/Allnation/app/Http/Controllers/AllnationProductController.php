<?php namespace Allnation\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Allnation\Models\AllnationProduct;
use Allnation\Http\Services\AllnationApi;
use App\Http\Controllers\Rest\RestControllerTrait;

/**
 * Class AllnationProductController
 * @package Allnation\Http\Controllers
 */
class AllnationProductController extends Controller
{
    use RestControllerTrait;

    const MODEL = AllnationProduct::class;

    protected $validationRules = [];

    /**
     * List allnation products for table
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;

        $list = $m::query();
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Fetch new products from AllNation
     *
     * @return void
     */
    public function fetchProducts(AllnationApi $api)
    {
        $lastDateTimeRequest = t('allnation.product.lastrequest');

        t('allnation.product.lastrequest',
            Carbon::now()->format('Y-m-d H:i:s'));

        $products = $api->fetchProducts($lastDateTimeRequest);

        if ($products) {
            foreach ($products as $product) {
                $productId = ltrim($product->CODIGO, '0');

                // Product already created
                if (AllnationProduct::find($productId)) continue;

                AllnationProduct::create([
                    'id'          => $productId,
                    'title'       => $product->DESCRICAO,
                    'category'    => implode(' > ', array_map('trim', [
                        $product->DEPARTAMENTO,
                        $product->CATEGORIA,
                        $product->SUBCATEGORIA
                    ])),
                    'brand'       => $product->FABRICANTE,
                    'description' => trim($product->DESCRTEC),
                    'ean'         => $product->EAN,
                    'ncm'         => trim($product->NCM),
                    'warranty'    => $product->GARANTIA . ' meses',
                    'weigth'      => ((float) $product->PESOKG),
                    'cost'        => number_format((float) $product->PRECOREVENDA, 2, '.', ''),
                    'image'       => preg_replace('/[\=][0-9]{3}[\&]/', '=800&',
                        $product->URLFOTOPRODUTO),
                    'stock_from'  => $product->ESTOQUE,
                    'width'       => ((float) $product->LARGURA) * 100,
                    'height'      => ((float) $product->ALTURA) * 100,
                    'length'      => ((float) $product->PROFUNDIDADE) * 100,
                    'origin'      => $product->ORIGEMPRODUTO
                ]);
            }
        }
    }
}
