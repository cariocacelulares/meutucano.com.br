<?php namespace Core\Http\Requests\Depot;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class DepotProductRequest extends FormRequest
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
            'depot_slug'  => "required|unique_with:depot_products,product_sku",
            'product_sku' => "required",
        ];
    }
}
