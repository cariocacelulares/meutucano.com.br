<?php namespace Core\Http\Controllers;

use Core\Models\PaymentMethod;
use App\Http\Controllers\Controller;

class PaymentMethodController extends Controller
{
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = PaymentMethod::all();

        return listResponse($data);
    }
}
