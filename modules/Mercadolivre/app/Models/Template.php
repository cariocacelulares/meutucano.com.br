<?php namespace Mercadolivre\Models;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Template
 * @package Mercadolivre\Models
 */
class Template extends Model
{
    use RevisionableTrait;

    protected $table = 'mercadolivre_templates';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'title',
        'html',
    ];
}
