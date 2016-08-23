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
}