<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Stock\RemovalProduct;
use Core\Models\Http\Requests\Stock\RemovalRequest as Request;

/**
 * Class RemovalController
 * @package Core\Http\Controllers\Stock
 */
class RemovalController extends Controller
{
    use RestControllerTrait;

    const MODEL = RemovalProduct::class;

    // cfg: stock_removal_status
}
