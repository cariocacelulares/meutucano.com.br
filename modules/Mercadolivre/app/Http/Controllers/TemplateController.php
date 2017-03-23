<?php namespace Mercadolivre\Http\Controllers;

use Core\Models\Produto;
use Mercadolivre\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Mercadolivre\Transformers\TemplateTransformer;

class TemplateController extends Controller
{
    use RestControllerTrait;

    const MODEL = Template::class;

    /**
     * Return templates to table list
     * @return response
     */
    public function tableList()
    {
        $m = self::MODEL;
        $list = $m::orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(TemplateTransformer::tableList($list));
    }
}
