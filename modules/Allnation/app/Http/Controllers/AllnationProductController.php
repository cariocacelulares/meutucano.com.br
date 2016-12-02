<?php namespace Allnation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Allnation\Http\Services\AllnationApi;

/**
 * Class AllnationProductController
 * @package Allnation\Http\Controllers
 */
class AllnationProductController extends Controller
{
    /**
     * Fetch new products from AllNation
     *
     * @return void
     */
    public function fetchProducts(AllnationApi $api)
    {
        $api->fetchProducts();
    }
}
