<?php namespace App\Models;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class UsuarioSenha
 * @package App\Models
 */
class UsuarioSenha extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $guarded = ['id'];
}
