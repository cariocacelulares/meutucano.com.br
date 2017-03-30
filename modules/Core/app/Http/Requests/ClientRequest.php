<?php namespace Core\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
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
            'taxvat' => 'required|min:10|numeric',
            'nome'   => 'required|min:3',
            'fone'   => 'required|min:8',
            'email'  => 'required|email',
        ];
    }

    /**
     * Set custom names to the attributes from request.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'taxvat' => 'documento',
            'fone'   => 'telefone',
            'email'  => 'e-mail',
        ];
    }
}
