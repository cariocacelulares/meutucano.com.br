<?php namespace Core\Http\Controllers;

use Core\Models\ShipmentMethod;
use App\Http\Controllers\Controller;

class ShipmentMethodController extends Controller
{
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = ShipmentMethod::all();

        return listResponse($data);
    }
}
