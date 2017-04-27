<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class Depot extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var string
     */
    public $primaryKey = 'slug';

    /**
     * @var boolean
     */
    public $incrementing = false;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'slug',
        'title',
        'include',
        'priority',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'include' => 'boolean',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function depotProducts()
    {
        return $this->hasMany(DepotProduct::class);
    }
}
