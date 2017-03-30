<?php namespace Mercadolivre\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class AdRequest extends FormRequest
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
            'title'           => "required|min:10|max:{$this->max_length}",
            'price'           => "required",
            'category_id'     => "required",
            'template_id'     => 'required_without:template_custom',
            'template_custom' => 'required_without:template_id'
        ];
    }
}
