<?php namespace Core\Http\Requests\Depot;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class DepotWithdrawProductRequest extends FormRequest
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
            'serials'           => "required|array",
            'depot_withdraw_id' => "required"
        ];
    }
}
