<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class OrderShipmentDevolution extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'order_shipment_id_id',
        'reason',
        'action',
        'note'
    ];

    /**
     * @return array
     */
    protected $appends = [
        'reason_cast'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function orderShipment()
    {
        return $this->belongsTo(OrderShipment::class);
    }

    /**
     * @return string
     */
    public function getReasonCastAttribute()
    {
        switch ($this->reason) {
            case 0:
                return 'Endereço insuficiente';
            case 1:
                return 'Não procurado (Retirada)';
            case 2:
                return 'Endereço incorreto';
            case 3:
                return 'Destinatário desconhecido';
            case 4:
                return 'Recusado';
            case 5:
                return 'Defeito';
            case 6:
                return 'Mudança';
            case 7:
                return 'Outro';
        }
    }
}
