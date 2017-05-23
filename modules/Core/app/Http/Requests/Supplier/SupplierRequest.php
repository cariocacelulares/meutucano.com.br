<?php namespace Core\Http\Requests\Supplier;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
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
            'name'         => "required|min:10",
            'taxvat'       => "required|numeric",
            'company_name' => "required|min:10",
            'zipcode'      => "required|numeric",
            'state'        => "required|max:2",
        ];
    }
}
