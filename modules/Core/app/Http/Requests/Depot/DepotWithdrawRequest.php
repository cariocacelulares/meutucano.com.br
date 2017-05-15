<?php namespace Core\Http\Requests\Depot;

use Illuminate\Validation\Rule;
use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class DepotWithdrawRequest extends FormRequest
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
            'depot_slug' => 'required',
            'serials'    => 'required|array',
            'user_id'    => [
                'required',
                Rule::unique('depot_withdraws')->where(function($query) {
                    $query->whereNull('closed_at');
                })
            ]
        ];
    }
}
