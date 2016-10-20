<?php namespace App\Models\Pedido;

use App\Models\Produto\Produto;
use App\Events\ProductDispach;
use App\Models\Inspecao\InspecaoTecnica;

/**
 * Class PedidoProduto
 * @package App\Models\Pedido
 */
class PedidoProduto extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'produto_sku',
        'valor',
        'quantidade',
        'imei'
    ];

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    // protected $with = ['produto'];

    /**
     * @var array
     */
    protected $appends = ['total'];

    /**
     * Actions
     */
    protected static function boot() {
        parent::boot();

        // Quando um novo pedido produto for criado
        static::saved(function($pedidoProduto) {
            $pedido = $pedidoProduto->pedido;
            $produto = $pedidoProduto->produto;

            if ($pedidoProduto->wasRecentlyCreated) {

                if ((int)$pedido->status !== 5) {
                    \Event::fire(new ProductDispach($pedidoProduto->produto, $pedidoProduto->quantidade));
                }
            }

            // Inspecao tecnica
            // se o status do pedido for qualquer um diferente de cancelado, for seminovo, e não tiver imei
            if ((int)$pedido->status !== 5 && $produto->estado == 1 && !$pedidoProduto->inspecao_tecnica && !$pedidoProduto->imei) {
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
                    } else {
                        // se não tem inspeção, cria uma (adiciona na fila)
                        $inspecao = InspecaoTecnica::create([
                            'produto_sku' => $produto->sku,
                            'pedido_produtos_id' => $pedidoProduto->id
                        ]);
                    }
                }
            }
        });
    }

    /**
     * Produto
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function produto()
    {
        return $this->hasOne(Produto::class, 'sku', 'produto_sku');
    }

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * InspecaoTecnica
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function inspecao_tecnica()
    {
        return $this->belongsTo(InspecaoTecnica::class, 'id', 'pedido_produtos_id');
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getTotalAttribute()
    {
        return $this->valor * $this->quantidade;
    }
}