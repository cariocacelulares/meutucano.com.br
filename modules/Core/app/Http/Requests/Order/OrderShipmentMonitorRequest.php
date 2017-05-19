<?php namespace Core\Http\Requests\Order;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class OrderShipmentMonitorRequest extends FormRequest
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
            'order_shipment_id' => 'required:unique_with:order_shipment_monitors,user_id',
            'user_id'           => 'required'
        ];
    }
}
