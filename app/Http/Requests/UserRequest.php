<?php namespace App\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
            'name'     => 'required|min:3',
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ];
    }
}
