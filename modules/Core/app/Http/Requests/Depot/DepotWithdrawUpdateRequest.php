<?php namespace Core\Http\Requests\Depot;

use Illuminate\Validation\Rule;
use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class DepotWithdrawUpdateRequest extends FormRequest
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
        $withdrawId = $this->route('withdraw');

        return [
            'serials'    => 'required|array',
            'user_id'    => [
                Rule::unique('depot_withdraws')->where(function($query) use($withdrawId) {
                    $query->whereNull('closed_at')
                        ->where('id', '!=', $withdrawId);
                })
            ]
        ];
    }
}
