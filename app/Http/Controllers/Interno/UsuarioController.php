<?php namespace App\Http\Controllers\Interno;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
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
            $v = \Validator::make(\Request::all(), $this->validationRules);

            if($v->fails())
                throw new \Exception("ValidationException");

            $data->fill(\Request::except(['password']));

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
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make($request->all(), $this->validationRules);

            if($v->fails())
                throw new \Exception("ValidationException");

            $data = new $m;
            $data->fill(\Request::except('password'));
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