<?php namespace Core\Models\Pedido;

/**
 * Class Imposto
 * @package Core\Models\Pedido
 */
class Imposto extends \Eloquent
{
    protected $table = 'pedido_impostos';

    /**
     * @var string
     */
    protected $primaryKey = 'pedido_id';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = ['*'];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
}
