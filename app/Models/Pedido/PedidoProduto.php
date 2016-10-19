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
            // se o status do pedido for qualquer um diferente de cancelado, e for seminovo
            if ((int)$pedido->status !== 5 && $produto->estado == 1 && !$pedidoProduto->inspecao_tecnica) {
                $itens = [];
                $pedidoProduto->quantidade = 2;
                if ($pedidoProduto->quantidade > 1) {
                    $imeis = explode(',', $pedidoProduto->imei);

                    for ($i = 0; $i < $pedidoProduto->quantidade; $i++) {
                        if ($pedidoProduto->imei && isset($imeis[$i])) {
                            $pedidoProduto->imei = $imeis[$i];
                        }

                        $itens[] = $pedidoProduto;
                    }
                } else {
                    $itens[] = $pedidoProduto;
                }

                foreach ($itens as $item) {
                    \Log::debug('item', [$item]);
                    // se o pedido nao tiver imei
                    if (!$item->imei) {
                        $inspecao = InspecaoTecnica
                            ::where('produto_sku', '=', $produto->sku)
                            ->whereNull('pedido_produtos_id')
                            ->whereNotNull('imei')
                            ->orderBy('created_at', 'ASC')
                            ->get()
                            ->first();
                    } else {
                        // se tiver imei (pega o mais antigo pra nao ficar la pra sempre)
                        $inspecao = InspecaoTecnica::where('imei', '=', $item->imei)->orderBy('created_at', 'ASC')->first();
                    }
                    \Log::debug('inspecao', [$inspecao]);

                    // se existe um imei do produto revisado, aguardando um pedido
                    if ($inspecao) {
                        // associado este pedido produto com a inspecao pronta
                        if (!$item->imei) {
                            $item->imei = $inspecao->imei;
                            $item->save();
                        }

                        $inspecao->pedido_produtos_id = $item->id;
                        $inspecao->save();
                        \Log::debug('inspecao relacionada', [$inspecao->id]);
                    } else {
                        // se não existe
                        $inspecao = InspecaoTecnica::create([
                            'produto_sku' => $produto->sku,
                            'pedido_produtos_id' => $item->id
                        ]);
                        \Log::debug('inspecao criada'. [$inspecao->id]);
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