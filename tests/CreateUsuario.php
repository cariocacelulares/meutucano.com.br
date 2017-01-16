<?php namespace Tests;

use App\Models\Usuario\Usuario;
use App\Models\Usuario\Role;

class CreateUsuario
{
    /**
    * Cria um objeto de usuário
    *
    * @return App\Models\Usuario\Usuario
    */
    public static function create($data = [])
    {
        $usuario = factory(Usuario::class)->create($data);

        return $usuario;
    }
}
