<?php namespace Core\Http\Requests\Stock;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class StockRequest extends FormRequest
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
            'title'    => 'required',
            'include'  => 'required',
            'priority' => 'required',
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
            'title'    => 'título',
            'include'  => 'incluir',
            'priority' => 'ordem de prioridade',
        ];
    }
}
