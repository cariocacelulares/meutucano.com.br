<?php namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Usuario;
use Illuminate\Support\Facades\Input;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;

/**
 * Class UsuarioController
 * @package App\Http\Controllers\Interno
 */
class UsuarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Usuario::class;

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;
        $m = new $m;

        $list = $this->handleRequest($m);

        return $this->listResponse($list);
    }

    /**
     * Update model
     *
     * @param $id
     * @return Response
     */
    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $data->fill(Input::except(['novasRoles', 'roles']));

            if (Input::get('novasRoles')) {
                $data->detachRoles();
                foreach (Input::get('novasRoles') as $role) {
                    if ($role) {
                        $data->roles()->attach($role);
                    }
                }
            }
            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            $data = ['exception' => $exception->getMessage()];

            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Store new user
     *
     * @return Response
     */
    public function store()
    {
        $m = self::MODEL;
        try {
            $data = new $m;
            $data->fill(Input::except(['novasRoles']));
            $data->save();

            if (Input::get('novasRoles')) {
                $data->detachRoles();
                foreach (Input::get('novasRoles') as $role) {
                    if ($role) {
                        $data->roles()->attach($role);
                    }
                }
            }

            $data->save();

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            $data = ['exception' => $exception->getMessage()];

            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Checa se a senha é igual
     *
     * @param  string $user_id
     * @return bool
     */
    public function checkPassword($user_id)
    {
        $password = Input::get('password');

        if ($usuario = Usuario::find($user_id)) {
            if (Hash::check($password, $usuario->password)) {
                return $this->showResponse(true);
            }
        }

        return $this->showResponse(false);
    }
}
