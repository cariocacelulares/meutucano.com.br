<?php namespace Core\Http\Requests\Customer;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
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
            'taxvat' => 'required|min:10|numeric',
            'name'   => 'required|min:3',
            'phone'  => 'required|min:8',
            'email'  => 'required|email',
        ];
    }
}
