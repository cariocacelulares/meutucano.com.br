<?php namespace Core\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'sku'      => "unique:products,sku,{$this->product},sku",
            'brand_id' => "required",
            'line_id'  => "required",
            'title'    => "required|min:10",
            'price'    => "required"
        ];
    }
}
