<?php namespace Tests;

use App\Models\Usuario\Usuario;

trait CreateUsuario
{

  /**
   * Cria um objeto de usuário
   *
   * @return App\Models\Usuario\Usuario
   */
  public function createUsuario($data = [])
  {
    return factory(Usuario::class)->create($data);
  }

  /**
   * Cria um token de autenticação para o usuário
   *
   * @param  App\Models\Usuario\Usuario $usuario
   * @return string
   */
  public function createUsuarioToken($usuario = null)
  {
    return JWTAuth::fromUser(
      ($usuario) ?: $this->createUsuario()
    );
  }
}