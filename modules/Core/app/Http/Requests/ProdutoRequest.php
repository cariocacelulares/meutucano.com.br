<?php namespace Core\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class ProdutoRequest extends FormRequest
{
    use JsonResponseTrait;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'sku'    => "required|unique:produtos,sku,{$this->originalSku},sku",
            'titulo' => "required|min:2",
            'valor'  => "required"
        ];
    }
}
