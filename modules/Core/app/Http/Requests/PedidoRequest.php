<?php namespace Core\Http\Requests;

use App\Http\Requests\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class PedidoRequest extends FormRequest
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
            'cliente_id'          => 'required',
            'cliente_endereco_id' => 'required',
            'frete_valor'         => 'required',
            'frete_metodo'        => 'required',
            'pagamento_metodo'    => 'required',
            'marketplace'         => 'required',
            'total'               => 'required',
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
            'cliente_id'          => 'cliente',
            'cliente_endereco_id' => 'endereço',
            'frete_valor'         => 'valor do frete',
            'frete_metodo'        => 'método de frete',
            'pagamento_metodo'    => 'método de pagamento',
            'marketplace'         => 'marketplace',
            'total'               => 'total',
        ];
    }
}
