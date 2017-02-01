<?php namespace Allnation\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Core\Models\Produto\Produto;
use Illuminate\Routing\Controller;
use Allnation\Models\AllnationProduct;
use Allnation\Http\Services\AllnationApi;
use Magento\Http\Controllers\MagentoController;
use App\Http\Controllers\Rest\RestControllerTrait;

/**
 * Class AllnationProductController
 * @package Allnation\Http\Controllers
 */
class AllnationProductController extends Controller
{
    use RestControllerTrait;

    const MODEL = AllnationProduct::class;

    /**
     * List allnation products for table
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;

        $list = $m::whereNull('produto_sku');
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Fetch new products from AllNation
     *
     * @return void
     */
    public function fetchProducts(AllnationApi $api = null)
    {
        $api = $api ?: new AllnationApi;

        $lastDateTimeRequest = t('allnation.product.lastrequest') ?: '2015-01-01 08:00:00';

        $products = $api->fetchProducts($lastDateTimeRequest);

        if ($products) {
            foreach ($products as $product) {
                $productId = ltrim($product->CODIGO, '0');

                // Product already created
                if (AllnationProduct::find($productId)) {
                    continue;
                }

                AllnationProduct::create([
                    'id'          => $productId,
                    'title'       => $product->DESCRICAO,
                    'category'    => implode(' > ', array_map('trim', [
                        $product->DEPARTAMENTO,
                        $product->CATEGORIA,
                        $product->SUBCATEGORIA
                    ])),
                    'brand'       => $product->FABRICANTE,
                    'description' => '<div>' . str_replace("\n", '</div><div>', trim($product->DESCRTEC)) . '</div>',
                    'ean'         => $product->EAN,
                    'ncm'         => trim($product->NCM),
                    'warranty'    => $product->GARANTIA . ' meses',
                    'weight'      => ((float) $product->PESOKG),
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

        t('allnation.product.lastrequest',
            Carbon::now()->format('Y-m-d H:i:s'));
    }

    /**
     * Create product inside magento and tucano
     *
     * @return void
     */
    public function createProduct(Request $request)
    {
        // Create produto on magento
        with(new MagentoController())->createProduct($request->all());

        // Create product on tucano
        if (!Produto::find($request->input('sku'))) {
            Produto::create([
                'sku'    => $request->input('sku'),
                'titulo' => $request->input('title'),
                'ncm'    => $request->input('ncm'),
                'ean'    => $request->input('ean')
            ]);
        }

        // Relaciona
        AllnationProduct::find($request->input('id'))
            ->update([
                'produto_sku' => $request->input('sku')
            ]);
    }

    /**
     * Fetch stock updates from AllNation
     *
     * @return void
     */
    public function fetchStocks(AllnationApi $api = null)
    {
        $api = $api ?: new AllnationApi;

        $lastDateTimeRequest = t('allnation.stock.lastrequest') ?: '2015-01-01 08:00:00';

        $products = $api->fetchStocks($lastDateTimeRequest);

        if ($products) {
            foreach ($products as $product) {
                $productId = ltrim($product->CODIGO, '0');

                $productAllNation = AllnationProduct::find($productId);
                if ($productAllNation) {
                    if ($sku = $productAllNation->produto_sku) {
                        if ($tucanoProduct = Produto::find($sku)) {
                            $tucanoProduct->estoque = (int) $product->ESTOQUEDISPONIVEL;
                            $tucanoProduct->valor   = ceil(((float) ($product->PRECOSEMST) * 0.9075) / 0.7075) - 0.10;
                            $tucanoProduct->save();
                        }
                    }
                }
            }
        }

        t('allnation.stock.lastrequest',
            Carbon::now()->format('Y-m-d H:i:s'));
    }
}
