<?php namespace Core\Http\Requests\Order;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    use JsonResponseTrait;

    /**
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * @return array
     */
    public function rules()
    {
        return [
            'customer_id'          => 'required',
            'customer_address_id'  => 'required',
            'shipment_method_slug' => 'required',
            'shipment_cost'        => 'required',
            'payment_method_slug'  => 'required',
            'installments'         => 'required',
            'taxes'                => 'required',
            'discount'             => 'required',
            'products'             => 'required|array',
        ];
    }
}
