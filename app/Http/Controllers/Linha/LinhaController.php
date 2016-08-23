<?php namespace App\Http\Controllers\Linha;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Linha;

/**
 * Class LinhaController
 * @package App\Http\Controllers\Linha
 */
class LinhaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Linha::class;

    protected $validationRules = [];
}