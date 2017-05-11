<?php namespace Core\Facades;

use Core\Models\Depot;
use Core\Models\DepotProduct;
use Illuminate\Support\Facades\Facade;

class StockProvider
{
    /**
     * Get stock information from SKU
     *
     * @param  int $sku
     * @param  string $depot
     * @return int
     */
    public function getObjects($sku, $depot = null)
    {
        $depotProduct = DepotProduct::with('depot');

        if (is_array($sku)) {
            $depotProduct = $depotProduct->whereIn('product_sku', $sku);
        } else {
            $depotProduct = $depotProduct->where('product_sku', $sku);
        }

        if ($depot) {
            $depotProduct->where('depot_slug', $depot);
        }

        return $depotProduct->get();
    }

    /**
     * Get stock quantity from SKU
     *
     * @param  int $sku
     * @param  string $depot
     * @return int
     */
    public function get($sku, $depot = null)
    {
        return DepotProduct::where('product_sku', $sku)
            ->where('depot_slug', $depot)
            ->pluck('quantity');
    }

    /**
     * Set stock quantity
     *
     * @param int $sku
     * @param int $quantity
     * @param string $depot
     */
    public function set($sku, $quantity, $depot = null)
    {
        return DepotProduct::updateOrCreate([
            'product_sku' => $sku,
            'depot_slug'  => $depot
        ], [
            'quantity' => $quantity
        ]);
    }

    /**
     * Add stock quantity
     *
     * @param int $sku
     * @param int $quantity
     * @param string $depot
     */
    public function add($sku, $quantity, $depot = null)
    {
        \Log::notice("Adicionando {$quantity} quantidade no estoque '{$depot}' do produto {$sku}");

        $depotProducts = DepotProduct::where('product_sku', $sku)
            ->where('depot_slug', $depot)
            ->get();

        $i = 0;
        foreach ($depotProducts as $depotProduct) {
            $depotProduct->quantity = ($depotProduct->quantity + $quantity);

            if ($depotProduct->save()) {
                $i++;
            }
        }

        return $i;
    }

    /**
     * Substract stock quantity
     *
     * @param int $sku
     * @param int $quantity
     * @param string $depot
     */
    public function substract($sku, $quantity, $depot = null)
    {
        \Log::notice("Subtraindo {$quantity} quantidade no estoque '{$depot}' do produto {$sku}");

        $depotProducts = DepotProduct::where('product_sku', $sku)
            ->where('depot_slug', $depot)
            ->get();

        $i = 0;
        foreach ($depotProducts as $depotProduct) {
            $depotProduct->quantity = ($depotProduct->quantity - $quantity);

            if ($depotProduct->save()) {
                $i++;
            }
        }

        return $i;
    }

    /**
     * Choose stock by priority
     *
     * @param  int|string $sku
     * @return string|null
     */
    public function choose($sku)
    {
        $default = $this->get($sku);

        if (isset($default[0]) && $default[0] > 0) {
            return 'default';
        } else {
            $depotProducts = DepotProduct::join('depots', 'depots.slug', 'depot_products.depot_slug')
                ->where('product_sku', $sku)
                ->where('depots.include', true)
                ->orderBy('depots.priority', 'ASC')
                ->get();

            foreach ($depotProducts as $depotProduct) {
                if ((int) $depotProduct->quantity > 0) {
                    return $depotProduct->depot_slug;
                }
            }
        }

        return null;
    }
}

class Stock extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'stockProvider';
    }
}
