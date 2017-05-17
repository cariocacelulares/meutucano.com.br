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

    public static function boot()
    {
        parent::boot();

        static::saving(function($depot) {
            $depot->slug = str_slug($depot->title);
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function depotProducts()
    {
        return $this->hasMany(DepotProduct::class, 'depot_slug');
    }
}
