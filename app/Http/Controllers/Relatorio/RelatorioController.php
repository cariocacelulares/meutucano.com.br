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

        /*
        $fields = Input::get('fields');
        $originalFields = Input::get('fields');

        // Relations
        $relation = Input::get('relation');
        $relations = [];
        if ($relation) {
            foreach ($relation as $key => $value) {
                if ($value === true) {
                    if ($key ==  'produto') {
                        $pedidos->join('pedido_produtos', 'pedido_produtos.pedido_id', '=', 'pedidos.id');
                        $pedidos->join('produtos', 'produtos.sku', '=', 'pedido_produtos.produto_sku');
                    } else {
                        $pedidos->with($key);
                    }

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
                    if ((!isset($config['value']['to']) || (!$config['value']['to'] && $config['value']['to'] !== 0)) && isset($config['value']['from'])) {
                        $config['operator'] = '>=';
                        $config['value'] = $config['value']['from'];
                    } elseif ((!isset($config['value']['from']) || (!$config['value']['from'] && $config['value']['from'] !== 0)) && isset($config['value']['to'])) {
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
                } else if ($config['operator'] == 'LIKE') {
                    $pedidos->where($key, $config['operator'], "%{$config['value']}%");
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
                $groupOrder = DB::raw('DAY(pedidos.created_at)');
            } elseif ($group == 'month') {
                $groupOrder = DB::raw('MONTH(pedidos.created_at)');
            } else {
                $groupOrder = $group;
            }

            if (in_array($group, ['day', 'month']) && $fields && !isset($fields['created_at'])) {
                $fields['created_at'] = 'Data';
            } else if ($group == 'cliente_enderecos.uf' && $fields && !isset($fields['endereco.uf'])) {
                    $fields['endereco.uf'] = 'Estado';
            } else if ($group == 'cliente_enderecos.cidade' && $fields && !isset($fields['endereco.cidade'])) {
                    $fields['endereco.cidade'] = 'Cidade';
            } else if ($group == 'clientes.nome' && $fields && !isset($fields['cliente.nome'])) {
                    $fields['cliente.nome'] = 'Nome';
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

        $getFields = ['pedidos.*'];
        foreach ($fields as $field => $value) {
            if (strstr($field, 'pedido_produtos.') || strstr($field, 'produtos.')) {
                $getFields[] = "{$field} AS {$field}";
            }
        }
        $pedidos = $pedidos->get($getFields)->toArray();

        // Campos
        if ($fields) {
            if ($group == 'marketplace_readable') {
                $fields['marketplace'] = 'Marketplace';
            }

            if ($group == 'status_description') {
                $fields['status'] = 'Status';
            }

            $keys = array_keys($fields);

            if (in_array('marketplace', $keys)) {
                $fields['marketplace_readable'] = 'Marketplace';
            }

            if (in_array('pagamento_metodo', $keys)) {
                $fields['pagamento_metodo_readable'] = 'Pagamento método';
            }

            if (in_array('frete_metodo', $keys)) {
                $fields['frete_metodo_readable'] = 'Frete método';
            }

            if (in_array('status', $keys)) {
                $fields['status_description'] = 'Status';
            }

            if ($relations) {
                foreach ($fields as $field => $value) {
                    foreach ($relations as $relation) {
                        if (strstr($field, "{$relation}.")) {
                            if (!isset($fields[$relation]) || !is_array($fields[$relation])) {
                                $fields[$relation] = [];
                            }

                            $fields[$relation][str_replace("{$relation}.", '', $field)] = $fields[$field];
                            unset($fields[$field]);
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

                    foreach ($pedidos[$key] as $field => $value) {
                        if (is_array($value)) {
                            foreach ($value as $relationKey => $relationValue) {
                                if (!isset($pedidos[$key][$relationKey])) {
                                    $pedidos[$key][$relationKey] = $relationValue;
                                } else {
                                    $pedidos[$key]["{$field}_{$relationKey}"] = $relationValue;
                                }
                            }
                            unset($pedidos[$key][$field]);
                        }
                    }
                }
            }
        }

        // Agrupamento
        if ($group) {
            foreach ($pedidos as $pedido) {
                $key = false;

                if (!isset($pedido[$group])) {
                    if ($group == 'day') {
                        $key = substr($pedido['created_at'], 0, 10);
                    } elseif ($group == 'month') {
                        $key = Carbon::createFromFormat('d/m/Y H:i', $pedido['created_at'])->format('m/Y');
                    } elseif ($group == 'clientes.nome') {
                        $key = (isset($pedido['cliente.nome'])) ? $pedido['clientes.nome'] : $pedido['nome'];
                    } elseif ($group == 'cliente_enderecos.cidade') {
                        $key = (isset($pedido['endereco.cidade'])) ? $pedido['cliente_enderecos.cidade'] : $pedido['cidade'];
                    } elseif ($group == 'cliente_enderecos.uf') {
                        $key = (isset($pedido['endereco.uf'])) ? $pedido['cliente_enderecos.uf'] : $pedido['uf'];
                    }
                }

                $key = ($key) ?: $pedido[$group];

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
        } else {
            foreach ($pedidos as $key => $pedido) {
                $aux = [];
                foreach ($originalFields as $field => $label) {
                    if (isset($pedido[$field])) {
                        $aux[$label] = $pedido[$field];
                    } else {
                        if (strstr($field, '.')) {
                            $pieces = explode('.', $field);
                            $index = (isset($pedidos[$key][$pieces[0] . '_' . $pieces[1]])) ? $pieces[0] . '_' . $pieces[1]: $pieces[1];
                            $aux[$fields[$pieces[0]][$pieces[1]]] = $pedido[$index];
                        }
                    }
                }
                $pedidos[$key] = $aux;
            }

            $list = $pedidos;
        }*/

        return $this->listResponse($list);
    }
}