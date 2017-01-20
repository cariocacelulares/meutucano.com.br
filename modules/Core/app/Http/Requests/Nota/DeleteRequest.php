<?php namespace Core\Http\Requests\Nota;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class DeleteRequest extends FormRequest
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
            'delete_note' => 'required|min:10',
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
            'delete_note' => 'motivo',
        ];
    }
}
