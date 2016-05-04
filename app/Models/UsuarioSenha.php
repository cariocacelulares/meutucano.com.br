<?php namespace App\Models;

/**
 * Class UsuarioSenha
 * @package App\Models
 */
class UsuarioSenha extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'usuario_id',
        'site',
        'url',
        'usuario',
        'senha',
    ];
}
