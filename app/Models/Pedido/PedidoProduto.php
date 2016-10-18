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
            if ($pedidoProduto->wasRecentlyCreated) {
                $pedido = $pedidoProduto->pedido;
                $produto = $pedidoProduto->produto;

                if ((int)$pedido->status !== 5) {
                    \Event::fire(new ProductDispach($pedidoProduto->produto, $pedidoProduto->quantidade));
                }
            }

            // Inspecao tecnica
            if ((int)$pedido->status !== 5 && $produto->estado == 1 && false) {
                // se o status do pedido for qualquer um diferente de cancelado, e for seminovo

                // se o pedido nao tiver imei
                if (!$pedidoProduto->imei) {
                    $inspecao = InspecaoTecnica
                        ::leftJoin('pedido_produtos', 'pedido_produtos.imei', '=', 'inspecao_tecnica.imei')
                        ->where('inspecao_tecnica.produto_sku', '=', $produto->sku)
                        ->whereNull('pedido_produtos.imei')
                        ->whereNotNull('inspecao_tecnica.imei')
                        ->orderBy('created_at', 'ASC')
                        ->get(['inspecao_tecnica.*'])
                        ->first();
                } else {
                    // se tiver imei
                    $inspecao = InspecaoTecnica::where('imei', '=', $pedidoProduto->imei)->orderBy('created_at', 'ASC')->first();
                }

                // se existe um imei do produto revisado, aguardando um pedido
                if ($inspecao) {
                    // associado este pedido produto com a inspecao pronta
                    if (!$pedidoProduto->imei) {
                        $pedidoProduto->imei = $inspecao->imei;
                        $pedidoProduto->save();
                    }

                    $inspecao->pedido_produtos_id = $pedidoProduto->id;
                    $inspecao->save();
                } else {
                    // se não existe
                    $inspecao = InspecaoTecnica::create([
                        'produto_sku' => $produto->sku,
                        'pedido_produtos_id' => $pedidoProduto->id
                    ]);
                }
            }
            $produto = $pedidoProduto->produto;

            if ((int)$pedido->status !== 5) {
                \Log::debug('pedido produto', [$pedidoProduto->produto, $pedidoProduto->quantidade]);
                \Event::fire(new ProductDispach($pedidoProduto->produto, $pedidoProduto->quantidade));
            }

            // Inspecao tecnica
            if ((int)$pedido->status !== 5 && $produto->estado == 1) {
                // se o status do pedido for qualquer um diferente de cancelado, e for seminovo

                // se o pedido nao tiver imei
                if (!$pedidoProduto->imei) {
                    $inspecao = InspecaoTecnica
                        ::leftJoin('pedido_produtos', 'pedido_produtos.imei', '=', 'inspecao_tecnica.imei')
                        ->where('inspecao_tecnica.produto_sku', '=', $produto->sku)
                        ->whereNull('pedido_produtos.imei')
                        ->whereNotNull('inspecao_tecnica.imei')
                        ->orderBy('created_at', 'ASC')
                        ->get(['inspecao_tecnica.*'])
                        ->first();
                } else {
                    // se tiver imei
                    $inspecao = InspecaoTecnica::where('imei', '=', $pedidoProduto->imei)->orderBy('created_at', 'ASC')->first();
                }

                // se existe um imei do produto revisado, aguardando um pedido
                if ($inspecao) {
                    // associado este pedido produto com a inspecao pronta
                    if (!$pedidoProduto->imei) {
                        $pedidoProduto->imei = $inspecao->imei;
                        $pedidoProduto->save();
                    }

                    $inspecao->pedido_produtos_id = $pedidoProduto->id;
                    $inspecao->save();
                } else {
                    // se não existe
                    $inspecao = InspecaoTecnica::create([
                        'produto_sku' => $produto->sku,
                        'pedido_produtos_id' => $pedidoProduto->id
                    ]);
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