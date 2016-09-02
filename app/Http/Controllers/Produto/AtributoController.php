<?php namespace App\Http\Controllers\Produto;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Produto\Atributo;

/**
 * Class AtributoController
 * @package App\Http\Controllers\Produto
 */
class AtributoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Atributo::class;

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