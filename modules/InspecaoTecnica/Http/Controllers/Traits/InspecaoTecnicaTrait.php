<?php namespace Modules\InspecaoTecnica\Http\Controllers\Traits;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Models\Pedido\PedidoProduto;
use Modules\InspecaoTecnica\Models\InspecaoTecnica;

/**
 * Class InspecaoTecnicaTrait
 * @package Modules\InspecaoTecnica\Http\Controllers\Traits
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