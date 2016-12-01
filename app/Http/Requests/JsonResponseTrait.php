<?php namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Response;

trait JsonResponseTrait
{
    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return mixed
     */
    protected function failedValidation(Validator $validator)
    {
        return with(new Response([
                'status' => 'ValidationFail',
                'code' => 400,
                'data' => $validator->errors()->getMessages()
            ], 400))
            ->header('Content-Type', 'application/json')
            ->throwResponse();
    }
}