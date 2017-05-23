<?php namespace Core\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class ProductSerialIssueRequest extends FormRequest
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
            'serial'      => 'required',
            'reason'      => 'required',
            'description' => 'required|min:5',
        ];
    }
}
