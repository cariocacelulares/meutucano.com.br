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

        // Relations
        $relation = Input::get('relation');
        $relations = [];
        if ($relation) {
            foreach ($relation as $key => $value) {
                if ($value === true) {
                    $pedidos->with($key);
                    $relations[] = $key;

                    if ($key == 'cliente') {
                        $pedidos->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id');
                    } else if ($key ==  'endereco') {
                        $pedidos->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id');
                    }
                }
            }
        }

        // FIlters (where)
        $filter = Input::get('filter');
        foreach ($filter as $key => $config) {
            if (isset($config['value']) && $config['value'] && $config['value'] !== 0) {
                $config['operator'] = (isset($config['operator']) && $config['operator']) ? $config['operator'] : '=';

                if (in_array($config['operator'], ['BETWEEN', 'IN']) && !is_array($config['value'])) {
                    $config['value']  = '=';
                }

                if ($config['operator'] == 'BETWEEN') {
                    if ((!isset($config['value']['to']) || is_null($config['value']['to']) || empty($config['value']['to'])) && isset($config['value']['from'])) {
                        $config['operator'] = '>=';
                        $config['value'] = $config['value']['from'];
                    } elseif ((!isset($config['value']['from']) || is_null($config['value']['from']) || empty($config['value']['from'])) && isset($config['value']['to'])) {
                        $config['operator'] = '<=';
                        $config['value'] = $config['value']['to'];
                    }
                }

                if ($config['operator'] == 'BETWEEN') {
                    foreach ($config['value'] as $chave => $valor) {
                        if (is_string($valor) && \DateTime::createFromFormat('d/m/Y', $valor) !== false) {
                            $config['value'][$chave] = Carbon::createFromFormat('d/m/Y', $valor)->format('Y-m-d');
                        }
                    }

                    $pedidos->whereBetween($key, [$config['value']['from'], $config['value']['to']]);
                } else if ($config['operator'] == 'IN') {
                    $pedidos->whereIn($key, array_keys($config['value']));
                } else {
                    if (is_string($config['value']) && \DateTime::createFromFormat('d/m/Y', $config['value']) !== false) {
                        $config['value'] = Carbon::createFromFormat('d/m/Y', $config['value'])->format('Y-m-d');
                    }

                    $pedidos->where($key, $config['operator'], $config['value']);
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
            /*} elseif ($group == 'cliente.nome') {
                $groupOrder = 'clientes.nome';
            } elseif ($group == 'endereco.cidade') {
                $groupOrder = 'cliente_enderecos.cidade';
            } elseif ($group == 'endereco.uf') {
                $groupOrder = 'cliente_enderecos.uf';*/
            } else {
                $groupOrder = $group;
            }

            $pedidos->orderBy($groupOrder, 'ASC');
        }

        $order = Input::get('order');
        if ($order) {
            foreach ($order as $key => $value) {
                $key = str_replace(['cliente.', 'endereco.'], ['clientes.', 'cliente_enderecos.'], $key);
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

            if ($relations) {
                foreach ($fields as $field => $value) {
                    foreach ($relations as $relation) {
                        if (strstr($field, "{$relation}.")) {
                            unset($fields[$field]);

                            if (!isset($fields[$relation]) || !is_array($fields[$relation])) {
                                $fields[$relation] = [];
                            }

                            $fields[$relation][str_replace("{$relation}.", '', $field)] = true;
                        }
                    }
                }
            }

            foreach ($pedidos as $key => $pedido) {
                $pedidos[$key] = array_intersect_key($pedido, $fields);

                if ($relations) {
                    foreach ($pedidos[$key] as $field => $value) {
                        if (is_array($value)) {
                            $pedidos[$key][$field] = array_intersect_key($pedidos[$key][$field], $fields[$field]);
                        }
                    }
                }
            }
        }

        // Agrupamento
        if ($group) {
            foreach ($pedidos as $pedido) {
                if ($group == 'day') {
                    $list[substr($pedido['created_at'], 0, 10)][] = $pedido;
                } elseif ($group == 'month') {
                    $list[Carbon::createFromFormat('d/m/Y H:i', $pedido['created_at'])->format('m/Y')][] = $pedido;
                } elseif ($group == 'clientes.nome') {
                    $list[$pedido['cliente']['nome']][] = $pedido;
                } elseif ($group == 'cliente_enderecos.cidade') {
                    $list[$pedido['endereco']['cidade']][] = $pedido;
                } elseif ($group == 'cliente_enderecos.uf') {
                    $list[$pedido['endereco']['uf']][] = $pedido;
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