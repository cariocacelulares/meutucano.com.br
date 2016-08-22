<?php namespace App\Http\Controllers\Interno;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Support\Facades\Input;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class UsuarioController
 * @package App\Http\Controllers\Interno
 */
class UsuarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Usuario::class;

    protected $validationRules = [];

    /**
     * Update model
     *
     * @param $id
     * @return Response
     */
    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id))
            return $this->notFoundResponse();

        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if($v->fails())
                throw new \Exception("ValidationException");

            $data->fill(Input::except(['password', 'novasRoles', 'roles']));

            if (Input::get('password'))
                $data->password = bcrypt(Input::get('password'));

            if (Input::get('novasRoles')) {
                $data->detachRoles();
                foreach (Input::get('novasRoles') as $role) {
                    if ($role) $data->roles()->attach($role);
                }
            }
            $data->save();

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if($v->fails())
                throw new \Exception("ValidationException");

            $data = new $m;
            $data->fill(Input::except(['password', 'novasRoles']));
            $data->save();

            if (Input::get('password'))
                $data->password = bcrypt(Input::get('password'));

            if (Input::get('novasRoles')) {
                $data->detachRoles();
                foreach (Input::get('novasRoles') as $role) {
                    if ($role) $data->roles()->attach($role);
                }
            }

            $data->save();

            return $this->createdResponse($data);
        }catch(\Exception $ex)
        {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}