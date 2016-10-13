<?php namespace App\Http\Controllers\Relatorio;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Pedido;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

/**
 * Class PedidoController
 * @package App\Http\Controllers\Relatorio
 */
class PedidoController extends Controller
{
    use RestResponseTrait;

    private $list;
    private $pedidos;

    private $relation;
    private $fields;
    private $filter;
    private $group;
    private $order;

    private function prepare()
    {
        // Pega todos os parametros
        if (Input::get('params')) {
            $params = json_decode(Input::get('params'), true);
            $this->relation = $params['relation'];
            $this->fields = $params['fields'];
            $this->filter = $params['filter'];
            $this->group = $params['group'];
            $this->order = $params['order'];
        } else {
            $this->relation = Input::get('relation');
            $this->fields = Input::get('fields');
            $this->filter = Input::get('filter');
            $this->group = Input::get('group');
            $this->order = Input::get('order');
        }

        // Relações - joins e with
        if ($this->relation) {
            // pra cada relaçao onde a chave é a relação e o valor é bool
            foreach ($this->relation as $rel => $bool) {
                if ($bool === true) {
                    if ($rel ==  'produtos') {
                        // join no pedido_produtos e no produtos pra ter acesso o nome do produto
                        $this->pedidos->join('pedido_produtos', 'pedido_produtos.pedido_id', '=', 'pedidos.id');
                        $this->pedidos->join('produtos', 'produtos.sku', '=', 'pedido_produtos.produto_sku');
                    } else if ($rel == 'cliente') {
                        $this->pedidos->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id');
                    } else if ($rel ==  'endereco') {
                        $this->pedidos->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id');
                    }

                    $this->pedidos->with($rel);
                }
            }
        }

        // Filtros - where
        if ($this->filter) {
            // para cada filtro onde a chave é o nome do campo e o valor é a configuração (operator, value)
            foreach ($this->filter as $field => $config) {
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

                            $this->pedidos->whereBetween($field, [$config['value']['from'], $config['value']['to']]);
                        }
                    } else if ($config['operator'] == 'IN') {
                        $this->pedidos->whereIn($field, array_keys($config['value']));
                    } else if ($config['operator'] == 'LIKE') {
                        $this->pedidos->where($field, $config['operator'], "%{$config['value']}%");
                    } else {
                        // se for uma data no formato d/m/Y, converte pra Y-m-d
                        if (is_string($config['value']) && \DateTime::createFromFormat('d/m/Y', $config['value']) !== false) {
                            $config['value'] = Carbon::createFromFormat('d/m/Y', $config['value'])->format('Y-m-d');
                        }

                        $this->pedidos->where($field, $config['operator'], $config['value']);
                    }
                }
            }
        }

        // Agrupamentos - preparação - ordenação e campos
        if ($this->group) {
            // se agrupar, precisa ordenar por este grupo, em alguns casos, alterar o campo que é ordenado
            if ($this->group == 'status') {
                $groupOrder = $this->group;
                $this->group = 'status_description';
            } elseif ($this->group == 'marketplace') {
                $groupOrder = $this->group;
                $this->group = 'marketplace_readable';
            } elseif ($this->group == 'day') {
                $groupOrder = DB::raw('DAY(pedidos.created_at)');
            } elseif ($this->group == 'month') {
                $groupOrder = DB::raw('MONTH(pedidos.created_at)');
            } else {
                $groupOrder = $this->group;
            }

            $this->pedidos->orderBy($groupOrder, 'ASC');
        }

        // Ordenação
        if ($this->order) {
            foreach ($this->order as $field) {
                $key = str_replace(['cliente.', 'endereco.'], ['clientes.', 'cliente_enderecos.'], $field['name']);
                $this->pedidos->orderBy($key, $field['order']);
            }
        }

        // pega apenas os campos do pedido pra colocar das outras entidades em um novo array
        $this->pedidos = $this->pedidos->get(['pedidos.*'])->toArray();

        // Mostra apenas os campos selecionados, na ordem que foram
        foreach ($this->pedidos as $key => $pedido) {
            $clearedOrder = [];

            if ($this->group) {
                if (strstr($this->group, '.')) {
                    $pieces = explode('.', $this->group);
                    $pieces[0] = str_replace(['clientes', 'cliente_enderecos', 'pedido_produtos'], ['cliente', 'endereco', 'produtos'], $pieces[0]);
                    $clearedOrder['group'] = array_key_exists($pieces[1], $pedido[$pieces[0]]) ? $pedido[$pieces[0]][$pieces[1]] : null;
                } else if ($this->group == 'day') {
                    $clearedOrder['group'] = substr($pedido['created_at'], 0, 10);
                } else if ($this->group == 'month') {
                    $clearedOrder['group'] = Carbon::createFromFormat('d/m/Y H:i', $pedido['created_at'])->format('m/Y');
                } else {
                    $clearedOrder['group'] = array_key_exists($this->group, $pedido) ? $pedido[$this->group] : null;
                }
            }

            // pra cada campo selecionado
            foreach ($this->fields as $field) {
                if ($field['name'] == 'status') {
                    $field['name'] = 'status_description';
                } else if ($field['name'] == 'marketplace') {
                    $field['name'] = 'marketplace_readable';
                } else if ($field['name'] == 'pagamento_metodo') {
                    $field['name'] = 'pagamento_metodo_readable';
                } else if ($field['name'] == 'frete_metodo') {
                    $field['name'] = 'frete_metodo_readable';
                }

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
                        foreach ($this->pedidos[$key]['produtos'] as $pedidoProduto) {
                            // se for titulo, pega do produto e nao do pedido produto
                            if ($pieces[1] == 'titulo') {
                                $clearedOrder['produtos'][$pedidoProduto['id']][$field['label']] = $pedidoProduto['produto'][$pieces[1]];
                            } else {
                                $clearedOrder['produtos'][$pedidoProduto['id']][$field['label']] = $pedidoProduto[$pieces[1]];
                            }
                        }
                    } else {
                        $clearedOrder[$field['label']] = $this->pedidos[$key][$pieces[0]][$pieces[1]];
                    }
                }
            }
            $this->pedidos[$key] = $clearedOrder;
        }

        if ($this->group) {
            $this->list = [];
            foreach ($this->pedidos as $pedido) {
                $this->group = $pedido['group'];
                unset($pedido['group']);
                $this->list[$this->group][] = $pedido;
            }

            $aux = [];
            foreach ($this->list as $this->group => $values) {
                $aux[] = [
                    'group' => $this->group,
                    'data' => $values
                ];
            }
            $this->list = $aux;
            unset($aux);
        } else {
            $this->list = $this->pedidos;
        }
    }

    private function getFile($return_type)
    {
        $data = \Excel::create("relatorio-pedidos-" . date('Y-m-d'), function($excel) {
            $excel->sheet("relatorio-pedidos-" . date('Y-m-d'), function($sheet) {
                if (!$this->group) {
                    foreach ($this->list as $key => $value) {
                        foreach ($value as $chave => $valor) {
                            if (is_array($valor)) {
                                foreach ($valor as $campo => $produto) {
                                    foreach ($produto as $field => $data) {
                                        $this->list[$key][$field][] = $data;
                                    }
                                }
                                unset($this->list[$key][$chave]);
                            }
                        }
                    }

                    foreach ($this->list as $key => $value) {
                        foreach ($value as $chave => $valor) {
                            if (is_array($valor)) {
                                $this->list[$key][$chave] = implode(',', $valor);
                            }
                        }
                    }

                    $sheet->setOrientation((count($this->list[0]) > 6) ? 'landscape' : 'portrait');
                } else {
                    $this->fields = array_map(create_function('$n', 'return \'\';'), $this->list[0]['data'][0]);

                    foreach ($this->list as $index => $item) {
                        $this->list[$index]['group'] = array_merge($this->fields, [key($this->fields) => $item['group']]);

                        foreach ($item['data'] as $indice => $linha) {
                            foreach ($linha as $key => $value) {
                                if (is_array($value)) {
                                    foreach ($value as $chave => $produtos) {
                                        foreach ($produtos as $campo => $valor) {
                                            if (isset($this->list[$index]['data'][$indice][$campo]) && $this->list[$index]['data'][$indice][$campo]) {
                                                $this->list[$index]['data'][$indice][$campo] .= ',' . $valor;
                                            } else {
                                                $this->list[$index]['data'][$indice][$campo] = $valor;
                                            }
                                        }
                                    }

                                    unset($this->list[$index]['data'][$indice][$key]);
                                }
                            }
                        }

                        $this->list[$index] = array_merge([$this->list[$index]['group']], array_values($this->list[$index]['data']));
                    }

                    $aux = [];
                    foreach ($this->list as $item) {
                        foreach ($item as $linha) {
                            $aux[] = $linha;
                        }
                    }
                    $this->list = $aux;
                }

                $sheet->fromArray($this->list);
            });
        })->export($return_type);//, storage_path('excel/exports'));

        return response()->make($data, '200')->header('Content-Type', 'image/' . $return_type);
    }

    public function run($return_type = 'array')
    {
        try {
            // Inicializa os pedidos
            $this->pedidos = Pedido::groupBy('pedidos.id');
            $this->list = [];

            $this->prepare();

            if (in_array($return_type, ['xls', 'pdf'])) {
                return $this->getFile($return_type);
            } else {
                return $this->listResponse($this->list);
            }

        } catch (\Exception $e) {
            \Log::warning(logMessage($e, 'Erro ao tentar gerar relatório'));
            return $this->notFoundResponse();
        }
    }
}