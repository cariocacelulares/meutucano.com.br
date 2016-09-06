<?php namespace App\Http\Controllers;

use App\Models\Produto;
use Artisaninweb\SoapWrapper\Facades\SoapWrapper;

/**
 * Class MagentoController
 * @package App\Http\Controllers
 */
class MagentoController extends Controller
{
    /**
     * @var SoapClient
     */
    protected $api;

    /**
     * Sessão de autenticação no magento
     * @var SoapSession
     */
    protected $session;

    public function feed()
    {
        echo 'id|title|description|google_product_category|product type|link|image link|condition|availability|price|sale price|gtin|brand';
        echo '<br>';
        //
        $products = $this->api->catalogCategoryAssignedProducts($this->session, 5);
        $stocks   = $this->api->catalogInventoryStockItemList($this->session, array_pluck($products, 'product_id'));
        $options  = $this->api->catalogProductAttributeOptions($this->session, 179);

        foreach ($products as $product) {
            $info = $this->api->catalogProductInfo($this->session, $product->product_id, null, [
                'additional_attributes' => [
                    'ean',
                    'fabricante'
                ]
            ]);

            $imagem = $this->api->catalogProductAttributeMediaList($this->session, $info->product_id);

            echo $info->sku;
            echo '|';
            echo $info->name;
            echo '|';
            echo $info->description;
            echo '|';
            echo '267';
            echo '|';
            echo 'Telefonia > Smartphones';
            echo '|';
            echo 'http://www.cariocacelulares.com.br/' . $info->url_path;
            echo '|';
            echo $imagem[0]->url;
            echo '|';
            echo 'new';
            echo '|';

            $key = array_search($info->product_id, array_column($stocks, 'product_id'));
            $stock = $stocks[$key]->is_in_stock;

            echo ((int) $stock > 0) ? 'in stock' : 'out of stock';
            echo '|';
            echo round($info->price, 2) . ' BRL';
            echo '|';
            echo (property_exists($info, 'special_price')) ? (round($info->special_price, 2)  . ' BRL') : '';
            echo '|';

            echo $ean = $info->additional_attributes[1]->value;
            echo '|';
            $marcaId = $info->additional_attributes[0]->value;

            $key = array_search((string) $marcaId, array_column($options, 'value'));
            echo $marca = $options[$key]->label;

            echo '<br>';
        }
    }

    /**
     * Create Soapwrapper
     *
     * @return void
     */
    public function __construct()
    {
        $this->api     = new \SoapClient(\Config::get('tucano.magento.api.host'));
        $this->session = $this->api->login(
            \Config::get('tucano.magento.api.user'),
            \Config::get('tucano.magento.api.key')
        );
    }

    /**
     * Update inventory from an item
     *
     * @return boolean
     */
    public function updateInventory($skuUpdates = null, $increase = true)
    {
        try {
            $stockInfo = $this->api->catalogInventoryStockItemList($this->session, array_keys($skuUpdates));

            foreach ($stockInfo as $mgProduct) {
                $stockChange = $skuUpdates[$mgProduct->sku] * (($increase) ? 1 : -1);
                $stock       = ((int) $mgProduct->qty) + $stockChange;

                $result = $this->api->catalogInventoryStockItemUpdate($this->session, $mgProduct->sku, [
                    'qty'         => $stock,
                    'is_in_stock' => ($stock > 0) ? 1 : 0
                ]);

                if ($result) return true;

                return false;
            }
        } catch (\Exception $e) {
            \Log::error('Não foi possível atualizar o estoque no Magento: ' . $e->getMessage() . ' - ' . $e->getLine());
            return false;
        }
    }
}
