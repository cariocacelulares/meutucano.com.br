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
        try {
            $list = [];
            // Pega todos os parametros
            $relation = Input::get('relation');
            $fields = Input::get('fields');
            $filter = Input::get('filter');
            $group = Input::get('group');
            $order = Input::get('order');

            // Inicializa os pedidos
            $pedidos = Pedido::whereNull('deleted_at');

            // Relações - joins e with
            if ($relation) {
                // pra cada relaçao onde a chave é a relação e o valor é bool
                foreach ($relation as $rel => $bool) {
                    if ($bool === true) {
                        if ($rel ==  'produtos') {
                            // join no pedido_produtos e no produtos pra ter acesso o nome do produto
                            $pedidos->join('pedido_produtos', 'pedido_produtos.pedido_id', '=', 'pedidos.id');
                            $pedidos->join('produtos', 'produtos.sku', '=', 'pedido_produtos.produto_sku');
                        } else if ($rel == 'cliente') {
                            $pedidos->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id');
                        } else if ($rel ==  'endereco') {
                            $pedidos->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id');
                        }

                        $pedidos->with($rel);
                        $relations[] = $rel;
                    }
                }
            }

            // Filtros - where
            if ($filter) {
                // para cada filtro onde a chave é o nome do campo e o valor é a configuração (operator, value)
                foreach ($filter as $field => $config) {
                    // se foi passado algum valor
                    if (isset($config['value']) && $config['value'] && $config['value'] !== 0) {
                        // se não foi passado o operador, considera =
                        $config['operator'] = (isset($config['operator']) && $config['operator']) ? $config['operator'] : '=';

                        // se o operador for in w between os valores precisam ser arrays, se não forem, considera o operador =
                        if (in_array($config['operator'], ['BETWEEN', 'IN']) && !is_array($config['value'])) {
                            $config['operator']  = '=';
                        }

                        // se o operador for between e só tiver um parametro, muda o operador pra >= ou <=
                        if ($config['operator'] == 'BETWEEN') {
                            if ((!isset($config['value']['to']) || (!$config['value']['to'] && $config['value']['to'] !== 0)) && isset($config['value']['from']) && $config['value']['from']) {
                                $config['operator'] = '>=';
                                $config['value'] = $config['value']['from'];
                            } elseif ((!isset($config['value']['from']) || (!$config['value']['from'] && $config['value']['from'] !== 0)) && isset($config['value']['to']) && $config['value']['to']) {
                                $config['operator'] = '<=';
                                $config['value'] = $config['value']['to'];
                            }
                        }

                        if ($config['operator'] == 'BETWEEN') {
                            if (($config['value']['from'] || $config['value']['from'] === 0) && ($config['value']['to'] || $config['value']['to'] === 0)) {
                                // se for uma data no formato d/m/Y, converte pra Y-m-d
                                foreach ($config['value'] as $chave => $valor) {
                                    if (is_string($valor) && \DateTime::createFromFormat('d/m/Y', $valor) !== false) {
                                        $config['value'][$chave] = Carbon::createFromFormat('d/m/Y', $valor)->format('Y-m-d');
                                    }
                                }

                                $pedidos->whereBetween($field, [$config['value']['from'], $config['value']['to']]);
                            }
                        } else if ($config['operator'] == 'IN') {
                            $pedidos->whereIn($field, array_keys($config['value']));
                        } else if ($config['operator'] == 'LIKE') {
                            $pedidos->where($field, $config['operator'], "%{$config['value']}%");
                        } else {
                            // se for uma data no formato d/m/Y, converte pra Y-m-d
                            if (is_string($config['value']) && \DateTime::createFromFormat('d/m/Y', $config['value']) !== false) {
                                $config['value'] = Carbon::createFromFormat('d/m/Y', $config['value'])->format('Y-m-d');
                            }

                            $pedidos->where($field, $config['operator'], $config['value']);
                        }
                    }
                }
            }

            // Agrupamentos - preparação - ordenação e campos
            if ($group) {
                // se agrupar, precisa ordenar por este grupo, em alguns casos, alterar o campo que é ordenado
                if ($group == 'status') {
                    $groupOrder = $group;
                    $group = 'status_description';
                } elseif ($group == 'marketplace') {
                    $groupOrder = $group;
                    $group = 'marketplace_readable';
                } elseif ($group == 'day') {
                    $groupOrder = DB::raw('DAY(pedidos.created_at)');
                } elseif ($group == 'month') {
                    $groupOrder = DB::raw('MONTH(pedidos.created_at)');
                } else {
                    $groupOrder = $group;
                }

                $pedidos->orderBy($groupOrder, 'ASC');
            }

            // Ordenação
            if ($order) {
                foreach ($order as $field) {
                    $key = str_replace(['cliente.', 'endereco.'], ['clientes.', 'cliente_enderecos.'], $field['name']);
                    $pedidos->orderBy($key, $field['order']);
                }
            }

            // pega apenas os campos do pedido pra colocar das outras entidades em um novo array
            $pedidos = $pedidos->get(['pedidos.*'])->toArray();

            // Mostra apenas os campos selecionados, na ordem que foram
            foreach ($pedidos as $key => $pedido) {
                $clearedOrder = [];

                if ($group) {
                    if (strstr($group, '.')) {
                        $pieces = explode('.', $group);
                        $pieces[0] = str_replace(['clientes', 'cliente_enderecos', 'pedido_produtos'], ['cliente', 'endereco', 'produtos'], $pieces[0]);
                        $clearedOrder['group'] = array_key_exists($pieces[1], $pedido[$pieces[0]]) ? $pedido[$pieces[0]][$pieces[1]] : null;
                    } else if ($group == 'day') {
                        $clearedOrder['group'] = substr($pedido['created_at'], 0, 10);
                    } else if ($group == 'month') {
                        $clearedOrder['group'] = Carbon::createFromFormat('d/m/Y H:i', $pedido['created_at'])->format('m/Y');
                    } else {
                        $clearedOrder['group'] = array_key_exists($group, $pedido) ? $pedido[$group] : null;
                    }
                }

                // pra cada campo selecionado
                foreach ($fields as $field) {
                    // se o campo existir, adiciona
                    if (array_key_exists($field['name'], $pedido)) {
                        $clearedOrder[$field['label']] = $pedido[$field['name']];
                    } else if (strstr($field['name'], '.')) {
                        $pieces = explode('.', $field['name']);

                        // o indice do array é produtos
                        if ($pieces[0] == 'pedido_produtos') {
                            $pieces[0] = 'produtos';
                        }

                        // se for um campo de produtos
                        if ($pieces[0] == 'produtos') {
                            // podem ter vários produtos
                            foreach ($pedidos[$key]['produtos'] as $pedidoProduto) {
                                // se for titulo, pega do produto e nao do pedido produto
                                if ($pieces[1] == 'titulo') {
                                    $clearedOrder['produtos'][$field['label']] = $pedidoProduto['produto'][$pieces[1]];
                                } else {
                                    $clearedOrder['produtos'][$field['label']] = $pedidoProduto[$pieces[1]];
                                }
                            }
                        } else {
                            $clearedOrder[$field['label']] = $pedidos[$key][$pieces[0]][$pieces[1]];
                        }
                    }
                }
                $pedidos[$key] = $clearedOrder;
            }

            if ($group) {
                $list = [];
                foreach ($pedidos as $pedido) {
                    $group = $pedido['group'];
                    unset($pedido['group']);
                    $list[$group][] = $pedido;
                }
            } else {
                $list = $pedidos;
            }

            return $this->listResponse($list);
        } catch (\Exception $e) {
            return $this->notFoundResponse();
        }
    }
}