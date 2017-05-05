<?php namespace App\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class UserPasswordRequest extends FormRequest
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
            'description' => 'required',
            'url'         => 'required|url',
            'username'    => 'required',
            'password'    => 'required',
        ];
    }
}
