<?php namespace Core\Http\Requests;

use Illuminate\Validation\Rule;
use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class DepotEntryRequest extends FormRequest
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
            'supplier_id'                 => 'required',
            'shipment_method'             => 'required',
            'payment_method_slug'         => 'required',
            'products'                    => 'required|array',
            'products.*.sku'              => 'distinct',
            'products.*.depot_product_id' => 'required',
            'products.*.cost'             => 'required',
            'products.*.serials'          => 'array|same_size_from:quantity',
            'products.*.serials.*'        => [
                'distinct',
                Rule::unique('product_serials', 'serial')->where(function ($query) {
                    $query->whereNull('deleted_at');
                })
            ]
        ];
    }
}
