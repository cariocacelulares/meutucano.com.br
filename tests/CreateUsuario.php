<?php namespace Tests;

use App\Models\Usuario\Usuario;
use App\Models\Usuario\Role;

trait CreateUsuario
{

  protected $user;

  /**
   * Cria um objeto de usuário
   *
   * @return App\Models\Usuario\Usuario
   */
  public function createUsuario($data = [])
  {
    if (!$this->user) {
      $role = Role::firstOrCreate([
        'name' => 'admin'
      ]);

      $usuario = factory(Usuario::class)->create($data);
      $usuario->roles()->save($role);

      $this->user = $usuario;
    }

    return $this->user;
  }
}