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
            'product_sku' => "required",
            'depot_slug'  => "required"
        ];
    }
}
