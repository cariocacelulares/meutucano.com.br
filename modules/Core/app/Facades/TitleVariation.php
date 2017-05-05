<?php namespace Core\Facades;

use Illuminate\Support\Facades\Facade;
use Core\Models\Produto;
use Core\Models\ProductTitleVariation;

class TitleVariationProvider
{
    /**
     * Set a new title variation to a product
     *
     * @param int $productSku    ref to product
     * @param string $title      variation title
     * @param string $ean        variation ean
     * @param string $ncm        variation ncm
     */
    public function set($productSku, $title, $ean = null)
    {
        $titleVariation = ProductTitleVariation::firstOrCreate([
            'product_sku' => $productSku,
            'title'       => $title,
            'ean'         => $ean
        ]);

        return $titleVariation;
    }

    /**
     * Get a title variation (exact or not) and saves if not exists
     *
     * @param  string $title variation title
     * @param  string $ean   variation ean
     * @param  string $ncm   variation ncm
     * @return TitleVariation|null
     */
    public function get($title, $ean = null)
    {
        $ean = $ean ?: null;
        $ncm = $ncm ?: null;

        $titleVariation = ProductTitleVariation::where('title', '=', $title)
            ->orWhere('ean', '=', $ean)
            ->orderBy('id', 'DESC')
            ->first();

        if (!$titleVariation) {
            $product = Produto::where('title', '=', $title)
                ->orWhere('ean', '=', $ean)
                ->orderBy('created_at', 'DESC')
                ->first();

            if ($product) {
                $titleVariation = $this->set(
                    $produto->sku,
                    $produto->title,
                    $produto->ean
                );
            }
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
