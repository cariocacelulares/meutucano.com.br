<?php namespace App\Http\Controllers\Linha;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\LinhaAtributo;

/**
 * Class LinhaAtributoController
 * @package App\Http\Controllers\Linha
 */
class LinhaAtributoController extends Controller
{
    use RestControllerTrait;

    const MODEL = LinhaAtributo::class;

    protected $validationRules = [];

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fromLinha($linha_id)
    {
        $m = self::MODEL;

        $m = $m::where('linha_id',  $linha_id)->get();

        return $this->listResponse($m);
    }
}