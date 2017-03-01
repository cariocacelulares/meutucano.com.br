<?php namespace Core\Http\Requests\Stock;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class IssueRequest extends FormRequest
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
            'imei'        => 'required',
            'reason'      => 'required',
            'description' => 'required|min:5',
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
            'reason'      => 'motivo',
            'description' => 'descrição / observação',
        ];
    }
}
