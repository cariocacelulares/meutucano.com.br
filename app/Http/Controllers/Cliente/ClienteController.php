<?php namespace App\Http\Controllers\Cliente;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;

/**
 * Class ClienteController
 * @package App\Http\Controllers\Cliente
 */
class ClienteController extends Controller
{
    use RestControllerTrait;

    const MODEL = Cliente::class;

    protected $validationRules = [];
}