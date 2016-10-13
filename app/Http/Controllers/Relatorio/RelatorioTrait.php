<?php namespace App\Http\Controllers\Relatorio;

/**
 * Trait RelatorioTrait
 * @package App\Http\Controllers\Relatorio
 */
trait RelatorioTrait
{
    private $list;
    private $model;

    private $relation;
    private $fields;
    private $filter;
    private $group;
    private $order;

    private function getFile($return_type)
    {
        $data = \Excel::create("relatorio-" . date('Y-m-d'), function($excel) {
            $excel->sheet("relatorio-" . date('Y-m-d'), function($sheet) {
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
                            } else if ($valor === 0) {
                                $this->list[$key][$chave] = '0';
                            }
                        }
                    }

                    foreach ($this->list as $key => $value) {
                        foreach ($value as $chave => $valor) {
                            if (is_array($valor)) {
                                $this->list[$key][$chave] = implode(',', $valor);
                            } else if ($valor === 0) {
                                $this->list[$key][$chave] = '0';
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
}