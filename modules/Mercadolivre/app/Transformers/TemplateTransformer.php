<?php namespace Mercadolivre\Transformers;

use Core\Transformers\Parsers\ProductParser;
use Mercadolivre\Transformers\Parsers\AdParser;

/**
 * Class TemplateTransformer
 * @package Core\Transformers
 */
class TemplateTransformer
{
    /**
     * @param  object $templates
     * @return array
     */
    public static function tableList($templates)
    {
        $pagination  = $templates->toArray();
        $transformed = [];

        foreach ($templates as $template) {
            $transformed[] = [
                'id'    => $template->id,
                'title' => $template->title,
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
