<?php namespace App\Listeners;

use App\Events\OrderSeminovo;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Inspecao\InspecaoTecnica;

class CheckInspecoes
{
    /**
     * Handle the event.
     *
     * @param  OrderSeminovo  $event
     * @return void
     */
    public function handle(OrderSeminovo $event)
    {
        $pedidoProduto = $event->pedidoProduto;
        $produto = $pedidoProduto->produto;
        \Log::debug('Listener CheckInspecoes ativado. pedidoProduto: ' . $pedidoProduto->id);

        // Pega as inspecoes disponveis para associar
        $inspecoesDisponiveis = InspecaoTecnica
            ::where('inspecao_tecnica.produto_sku', '=', $produto->sku)
            ->whereNull('inspecao_tecnica.pedido_produtos_id')
            ->whereNotNull('inspecao_tecnica.imei')
            ->orderBy('created_at', 'ASC')
            ->get(['inspecao_tecnica.*']);

        // Organiza as inspeções em um array
        $aux = [];
        foreach ($inspecoesDisponiveis as $inspecaoDisponivel) {
            $aux[] = $inspecaoDisponivel;
        }
        $inspecoesDisponiveis = $aux;
        unset($aux);

        // pra cada quantidade do produto
        for ($i = 0; $i < $pedidoProduto->quantidade; $i++) {
            $inspecao = null;
            // se tiver alguma inspecao, usa ela e tira ela do array
            if (!empty($inspecoesDisponiveis) && $inspecoesDisponiveis[0]) {
                $inspecao = $inspecoesDisponiveis[0];
                unset($inspecoesDisponiveis[0]);
                $inspecoesDisponiveis = array_values($inspecoesDisponiveis);
            }

            if ($inspecao) {
                // Concatena os imeis
                if ($pedidoProduto->imei) {
                    $pedidoProduto->imei = $pedidoProduto->imei . ',' . $inspecao->imei;
                } else {
                    $pedidoProduto->imei = $inspecao->imei;
                }
                $pedidoProduto->save();

                $inspecao->pedido_produtos_id = $pedidoProduto->id;
                $inspecao->save();
                \Log::notice("Inspecao {$inspecao->id} relacionada com o pedidoProduto {$pedidoProduto->id}");
            } else {
                // se não tem inspeção, cria uma (adiciona na fila)
                $inspecao = InspecaoTecnica::create([
                    'produto_sku' => $produto->sku,
                    'pedido_produtos_id' => $pedidoProduto->id
                ]);
                \Log::notice("Inspecao {$inspecao->id} adicionada na fila com o pedidoProduto {$pedidoProduto->id}");
            }
        }
    }
}