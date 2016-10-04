<?php namespace App\Http\Controllers\Relatorio;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Pedido;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

/**
 * Class RelatorioController
 * @package App\Http\Controllers\Relatorio
 */
class RelatorioController extends Controller
{
    use RestResponseTrait;

    public function pedido()
    {
        $list = [];
        $pedidos = Pedido::whereNull('deleted_at');

        $filter = Input::get('filter');

        // FIlters (where)
        foreach ($filter as $key => $config) {
            if (isset($config['value']) && $config['value'] && $config['value'] !== 0) {
                $config['operator'] = (isset($config['operator']) && $config['operator']) ? $config['operator'] : '=';

                if (($config['operator']) == 'BETWEEN' && !is_array($config['value'])) {
                    $config['value']  = '=';
                }

                if (($config['operator']) == 'BETWEEN') {
                    foreach ($config['value'] as $chave => $valor) {
                        if (is_string($valor) && \DateTime::createFromFormat('d/m/Y', $valor) !== false) {
                            $config['value'][$chave] = Carbon::createFromFormat('d/m/Y', $valor)->format('Y-m-d');
                        }
                    }

                    $pedidos->whereBetween($key, [$config['value']['from'], $config['value']['to']]);
                } else {
                    $pedidos->where($key, '=', $config['value']);
                }
            }
        }

        // Group
        $group = Input::get('group');
        if ($group) {
            if ($group == 'status') {
                $groupOrder = $group;
                $group = 'status_description';
            } elseif ($group == 'marketplace') {
                $groupOrder = 'marketplace';
                $group = 'marketplace_readable';
            } elseif ($group == 'day') {
                $groupOrder = DB::raw('DAY(created_at)');
            } elseif ($group == 'month') {
                $groupOrder = DB::raw('MONTH(created_at)');
            } else {
                $groupOrder = $group;
            }

            $pedidos->orderBy($groupOrder, 'ASC');
        }

        $order = Input::get('order');
        if ($order) {
            foreach ($order as $key => $value) {
                $pedidos->orderBy($key, $value['order']);
            }
        }

        $pedidos = $pedidos->get()->toArray();

        // Campos
        $fields = Input::get('fields');
        if ($fields) {
            if ($group == 'marketplace_readable') {
                $fields['marketplace'] = '';
            }

            if ($group == 'status_description') {
                $fields['status'] = '';
            }

            $keys = array_keys($fields);

            if (in_array('marketplace', $keys)) {
                $fields['marketplace_readable'] = '';
            }

            if (in_array('pagamento_metodo', $keys)) {
                $fields['pagamento_metodo_readable'] = '';
            }

            if (in_array('frete_metodo', $keys)) {
                $fields['frete_metodo_readable'] = '';
            }

            if (in_array('status', $keys)) {
                $fields['status_description'] = '';
            }

            foreach ($pedidos as $key => $pedido) {
                $pedidos[$key] = array_intersect_key($pedido, $fields);
            }
        }

        // Agrupamento
        if ($group) {
            foreach ($pedidos as $pedido) {
                if ($group == 'day') {
                    $list[substr($pedido['created_at'], 0, 10)][] = $pedido;
                } elseif ($group == 'month') {
                    $list[Carbon::createFromFormat('d/m/Y H:i', $pedido['created_at'])->format('m/Y')][] = $pedido;
                } else {
                    $key = $pedido[$group];

                    if ($group == 'marketplace_readable') {
                        unset($pedido['marketplace_readable']);
                        unset($pedido['marketplace']);
                    }

                    if ($group == 'status_description') {
                        unset($pedido['status_description']);
                        unset($pedido['status']);
                    }

                    $list[$key][] = $pedido;
                }
            }
        } else {
            $list = $pedidos;
        }

        return $this->listResponse($list);
    }
}