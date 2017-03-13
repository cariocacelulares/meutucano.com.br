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

    public function get($title, $ean = null, $ncm = null)
    {
        $ean = $ean ?: null;
        $ncm = $ncm ?: null;

        $titleVariation = TitleVariationModel
            ::where('title', '=', $title)
            ->where('ean', '=', $ean)
            ->where('ncm', '=', $ncm)
            ->first();

        if (!$titleVariation) {
            $titleVariation = TitleVariationModel
            ::where('title', '=', $title)
            ->where('ean', '=', $ean)
            ->first();
        }

        if (!$titleVariation) {
            $titleVariation = TitleVariationModel
                ::where('title', '=', $title)
                ->where('ncm', '=', $ncm)
                ->first();
        }

        if (!$titleVariation) {
            $titleVariation = TitleVariationModel
                ::where('title', '=', $title)
                ->orWhere('ean', '=', $ean)
                ->orWhere('ncm', '=', $ncm)
                ->first();
        }

        if (!$titleVariation) {
            $produto = Produto
                ::where('titulo', '=', $title)
                ->orWhere('ean', '=', $ean)
                ->orWhere('ncm', '=', $ncm)
                ->first();

            if ($produto) {
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
