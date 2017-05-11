<?php namespace Core\Facades;

use Illuminate\Support\Facades\Facade;
use Core\Models\Product;
use Core\Models\ProductTitleVariation;

class TitleVariationProvider
{
    /**
     * Set a new title variation to a product
     *
     * @param int $productSku    ref to product
     * @param string $title      variation title
     * @return ProductTitleVariation
     */
    public function set($productSku, $title)
    {
        $titleVariation = ProductTitleVariation::firstOrCreate([
            'product_sku' => $productSku,
            'title'       => $title
        ]);

        return $titleVariation;
    }

    /**
     * Get a title variation
     *
     * @param  string $title variation title
     * @return TitleVariation|null
     */
    public function get($title)
    {
        $titleVariation = ProductTitleVariation::orderBy('id', 'DESC');

        if (is_array($title)) {
            $titleVariation = $titleVariation->whereIn('title', $title)->get();
        } else {
            $titleVariation = $titleVariation->where('title', $title)->first();
        }

        return $titleVariation ?: null;
    }
}

class TitleVariation extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'titleVariationProvider';
    }
}
