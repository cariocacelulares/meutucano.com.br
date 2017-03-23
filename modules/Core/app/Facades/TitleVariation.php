<?php namespace Core\Facades;

use Illuminate\Support\Facades\Facade;
use Core\Models\Produto;
use Core\Models\Produto\TitleVariation as TitleVariationModel;

/**
 * TitleVariationProvider
 * @package Core\Facades;
 */
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
    public function set($productSku, $title, $ean = null, $ncm = null)
    {
        $titleVariation = TitleVariationModel::firstOrCreate([
            'product_sku' => $productSku,
            'title'       => $title,
            'ean'         => $ean,
            'ncm'         => $ncm,
        ]);

        return $titleVariation;
    }

    /**
     * Get exact variation or null
     *
     * @param  string $title
     * @param  string $ean
     * @param  string $ncm
     * @return TitleVariation|null
     */
    public function getExact($title, $ean = null, $ncm = null)
    {
        $ean = $ean ?: null;
        $ncm = $ncm ?: null;

        $titleVariation = TitleVariationModel
            ::where('title', '=', $title)
            ->where('ean', '=', $ean)
            ->where('ncm', '=', $ncm)
            ->orderBy('id', 'DESC')
            ->first();

        return $titleVariation ?: null;
    }

    /**
     * Get a title variation (exact or not) and saves if not exists
     *
     * @param  string $title variation title
     * @param  string $ean   variation ean
     * @param  string $ncm   variation ncm
     * @return TitleVariation|null
     */
    public function get($title, $ean = null, $ncm = null)
    {
        $ean = $ean ?: null;
        $ncm = $ncm ?: null;

        $titleVariation = TitleVariationModel
            ::where('title', '=', $title)
            ->where('ean', '=', $ean)
            ->where('ncm', '=', $ncm)
            ->orderBy('id', 'DESC')
            ->first();

        if (!$titleVariation) {
            $titleVariation = TitleVariationModel
            ::where('title', '=', $title)
            ->where('ean', '=', $ean)
            ->orderBy('id', 'DESC')
            ->first();
        }

        if (!$titleVariation) {
            $titleVariation = TitleVariationModel
                ::where('title', '=', $title)
                ->where('ncm', '=', $ncm)
                ->orderBy('id', 'DESC')
                ->first();
        }

        if (!$titleVariation) {
            $titleVariation = TitleVariationModel
                ::where('title', '=', $title)
                ->orWhere('ean', '=', $ean)
                ->orWhere('ncm', '=', $ncm)
                ->orderBy('id', 'DESC')
                ->first();
        }

        if (!$titleVariation) {
            $produto = Produto
                ::where('titulo', '=', $title)
                ->orWhere('ean', '=', $ean)
                ->orWhere('ncm', '=', $ncm)
                ->orderBy('created_at', 'DESC')
                ->first();

            if ($produto &&
                is_null($this->getExact($produto->titulo, $produto->eac, $produto->ncm))) {
                $titleVariation = $this->set(
                    $produto->sku,
                    $produto->titulo,
                    $produto->eac,
                    $produto->ncm
                );
            }
        }

        return $titleVariation ?: null;
    }
}

/**
 * Facade register
 * @package Core\Facades;
 */
class TitleVariation extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'titleVariationProvider';
    }
}
