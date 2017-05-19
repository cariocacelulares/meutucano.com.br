<?php namespace Core\Http\Controllers;

use Core\Models\Marketplace;
use App\Http\Controllers\Controller;

class MarketplaceController extends Controller
{
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = Marketplace::all();

        return listResponse($data);
    }
}
