<?php namespace App\Http\Controllers\Inspecao;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Inspecao\InspecaoTecnica;
use App\Models\Pedido\PedidoProduto;
use Illuminate\Support\Facades\Input;

/**
 * Class InspecaoTecnicaTrait
 * @package App\Http\Controllers\Inspecao
 */
trait InspecaoTecnicaTrait
{
    public function aplicarDevolucao($inspecoes)
    {
        if (is_array($inspecoes) && !empty($inspecoes)) {
            if (is_array($inspecoes['criar']) && !empty($inspecoes['criar'])) {
                foreach ($inspecoes['criar'] as $config) {
                    if ($config['aplicar']) {
                        InspecaoTecnica::create([
                            'produto_sku' => $config['produto_sku'],
                            'pedido_produtos_id' => $config['pedido_produtos_id'],
                            'solicitante_id' => getCurrentUserId()
                        ]);
                    }
                }
            }

            if (is_array($inspecoes['reservar']) && !empty($inspecoes['reservar'])) {
                foreach ($inspecoes['reservar'] as $config) {
                    if ($config['aplicar']) {
                        if ($inspecao = InspecaoTecnica::where('id', '=', $config['inspecao_id'])->whereNull('pedido_produtos_id')->where('reservado', '=', false)->first()) {
                            $inspecao->pedido_produtos_id = $config['pedido_produtos_id'];
                            $inspecao->solicitante_id = getCurrentUserId();
                            $inspecao->save();

                            if ($pedidoProduto = PedidoProduto::find($config['pedido_produtos_id'])) {
                                $pedidoProduto->imei = $config['imei'];
                                $pedidoProduto->save();
                            } else {
                                \Log::warning("A inspeção técnica {$config['inspecao_id']} não foi associada ao pedidoProduto {$config['pedido_produtos_id']} pois não foi possível encontrar ele", $config);
                            }
                        } else {
                            \Log::warning("A inspeção técnica {$config['inspecao_id']} não foi associada ao pedidoProduto {$config['pedido_produtos_id']} pois não está liberada, foi adicionada uma nova inspeção na fila", $config);
                            InspecaoTecnica::create([
                                'produto_sku' => $config['produto_sku'],
                                'pedido_produtos_id' => $config['pedido_produtos_id'],
                                'solicitante_id' => getCurrentUserId()
                            ]);
                        }
                    }
                }
            }
        }
    }
}