<?php namespace App\Http\Controllers;

use App\Models\Produto\Produto;
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
