<?php namespace Modules\Sugestao\Http\Requests;

use Joselfonseca\LaravelApiTools\Http\Requests\ApiRequest as Request;

class SugestaoRequest extends Request
{
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
            'descricao' => 'required|min:5',
            'setor'     => 'required',
            'pessoa'    => 'required',
        ];
    }
}
