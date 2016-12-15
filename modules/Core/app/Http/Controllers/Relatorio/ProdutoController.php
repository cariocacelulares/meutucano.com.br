<?php namespace Core\Http\Controllers\Relatorio;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\Produto;
use Core\Http\Controllers\Traits\RelatorioTrait;

/**
 * Class ProdutoController
 * @package Core\Http\Controllers\Relatorio
 */
class ProdutoController extends Controller
{
    use RestResponseTrait, RelatorioTrait;

    /**
     * Prepara o retorno, pega os parametros, fields, group, order, filters...
     *
     * @return void
     */
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
                    if ($rel ==  'pedido') {
                        $this->model->join('pedido_produtos', 'pedido_produtos.produto_sku', '=', 'produtos.sku');
                        $this->model->join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id');
                    } else {
                        $this->model->with($rel);
                    }
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

                            $this->model->whereBetween($field, [$config['value']['from'], $config['value']['to']]);
                        }
                    } else if ($config['operator'] == 'IN') {
                        $this->model->whereIn($field, array_keys($config['value']));
                    } else if ($config['operator'] == 'LIKE') {
                        $this->model->where($field, $config['operator'], "%{$config['value']}%");
                    } else {
                        // se for uma data no formato d/m/Y, converte pra Y-m-d
                        if (is_string($config['value']) && \DateTime::createFromFormat('d/m/Y', $config['value']) !== false) {
                            $config['value'] = Carbon::createFromFormat('d/m/Y', $config['value'])->format('Y-m-d');
                        }

                        $this->model->where($field, $config['operator'], $config['value']);
                    }
                }
            }
        }

        // Agrupamentos - preparação - ordenação e campos
        if ($this->group) {
            $groupOrder = $this->group;
            // $this->model->orderBy($groupOrder, 'ASC');
        }

        // Ordenação
        if ($this->order) {
            foreach ($this->order as $field) {
                $key = str_replace(['cliente.', 'endereco.'], ['clientes.', 'cliente_enderecos.'], $field['name']);
                $this->model->orderBy($key, $field['order']);
            }
        }

        // pega os campos do produto e apenas o id dos pedidos e da tabela pivot
        $getFields = ['produtos.*'];
        if (isset($this->relation['pedido']) && $this->relation['pedido']) {
            $getFields[] = DB::raw('pedido_produtos.id AS \'pedido_produtos.id\'');
            $getFields[] = DB::raw('pedido_produtos.quantidade AS \'pedido_produtos.quantidade\'');
            $getFields[] = DB::raw('pedido_produtos.valor AS \'pedido_produtos.valor\'');

            $getFields[] = DB::raw('pedidos.id AS \'pedidos.id\'');
            $getFields[] = DB::raw('pedidos.codigo_marketplace AS \'pedidos.codigo_marketplace\'');
            $getFields[] = DB::raw('pedidos.marketplace AS \'pedidos.marketplace\'');
            $getFields[] = DB::raw('pedidos.status AS \'pedidos.status\'');
            $getFields[] = DB::raw('pedidos.total AS \'pedidos.total\'');
            $getFields[] = DB::raw('pedidos.estimated_delivery AS \'pedidos.estimated_delivery\'');
            $getFields[] = DB::raw('pedidos.created_at AS \'pedidos.created_at\'');
        }
        $this->model = $this->model->get($getFields)->toArray();

        // Mostra apenas os campos selecionados, na ordem que foram
        foreach ($this->model as $key => $produto) {
            if (isset($produto['pedidos.status'])) {
                $status = $produto['pedidos.status'];
                $status = (is_null($status)) ? 'Desconhecido' : \Config::get('core.pedido_status')[$status];
                $produto['pedidos.status'] = $status;
                $this->model[$key]['pedidos.status'] = $status;
            }

            $clearedOrder = [];

            if ($this->group) {
                $clearedOrder['group'] = array_key_exists($this->group, $produto) ? $produto[$this->group] : null;
            }

            // pra cada campo selecionado
            foreach ($this->fields as $field) {
                if ($field['name'] == 'estado') {
                    $field['name'] = 'estado_description';
                }

                // se o campo existir, adiciona
                if (array_key_exists($field['name'], $produto)) {
                    if ($field['name'] == 'pedidos.created_at' && is_string($produto['pedidos.created_at']) && \DateTime::createFromFormat('Y-m-d H:i:s', $produto['pedidos.created_at']) !== false) {
                        $clearedOrder[$field['label']] = Carbon::createFromFormat('Y-m-d H:i:s', $produto['pedidos.created_at'])->format('d/m/Y H:i');
                    } else if ($field['name'] == 'pedidos.estimated_delivery' && is_string($produto['pedidos.estimated_delivery']) && \DateTime::createFromFormat('Y-m-d', $produto['pedidos.estimated_delivery']) !== false) {
                        $clearedOrder[$field['label']] = Carbon::createFromFormat('Y-m-d', $produto['pedidos.estimated_delivery'])->format('d/m/Y');
                    } else {
                        $clearedOrder[$field['label']] = $produto[$field['name']];
                    }
                }
            }
            $this->model[$key] = $clearedOrder;
        }

        if ($this->group) {
            $this->list = [];
            foreach ($this->model as $produto) {
                $this->group = $produto['group'];
                unset($produto['group']);
                $this->list[$this->group][] = $produto;
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
            $this->list = $this->model;
        }
    }

    /**
     * Invoca todos os metodos necessários para retornar a lista de acordo com os parametros
     *
     * @param  string $return_type tipo de retorno
     * @return Response|void
     */
    public function run($return_type = 'array')
    {
        try {
            // Inicializa os pedidos
            $this->model = Produto::where(DB::raw('1'), '=', '1');
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