<?php namespace Core\Transformers;

use Carbon\Carbon;
use Core\Models\Pedido\Pedido;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class PedidoTransformer
 * @package Core\Transformers
 */
class PedidoTransformer
{
    public static function __callStatic($method, $arguments)
    {
        $obj = new PedidoTransformer;

        if ($arguments[0] instanceof Pedido) {
            return $obj->$method($arguments[0]);
        } elseif (is_array($arguments[0]) || $arguments[0] instanceof LengthAwarePaginator || $arguments[0] instanceof Collection) {
            $itens = [];
            foreach ($arguments[0] as $item) {
                $itens[] = $obj->$method($item);
            }

            return $itens;
        }

        throw new \Exception("Call to undefined static method '{$method}' in " . get_class(), 1);
    }

    protected function list(Pedido $order)
    {
        return [
            'id'                   => $order->id,
            'codigo_marketplace'   => $order->codigo_marketplace,
            'marketplace_readable' => $order->marketplace_readable,
            'cliente'              => [
                'nome' => $order->cliente->nome,
                'fone' => $order->cliente->fone,
            ],
            'endereco'             => [
                'cep'          => $order->endereco->cep,
                'cep_readable' => $order->endereco->cep_readable,
                'cidade'       => $order->endereco->cidade,
                'uf'           => $order->endereco->uf,
            ],
            'status'               => $order->status,
            'total'                => $order->total,
            'created_at'           => $order->created_at,
            'status_description'   => $order->status_description,
            'reembolso'            => $order->reembolso,
            'segurado'             => $order->segurado,
            'protocolo'            => $order->protocolo,
        ];
    }
}
