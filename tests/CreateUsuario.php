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
  public function createUsuario($data = [], $role = 'admin')
  {
    // $role = Role::firstOrCreate([
    //   'name' => $role
    // ]);

    $usuario = factory(Usuario::class)->create($data);
    // $usuario->roles()->save($role);

    return $usuario;
  }
}