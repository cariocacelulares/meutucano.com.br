<?php namespace Tests;

use App\Models\Usuario\Usuario;
use App\Models\Usuario\Role;

trait CreateUsuario
{

  /**
   * Cria um objeto de usuário
   *
   * @return App\Models\Usuario\Usuario
   */
  public function createUsuario($data = [])
  {
    $usuario = factory(Usuario::class)->create($data);

    return $usuario;
  }
}