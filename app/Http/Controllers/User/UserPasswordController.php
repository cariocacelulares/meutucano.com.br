<?php namespace App\Http\Controllers\User;

use App\Models\User\UserPassword;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use App\Http\Requests\UserPasswordRequest as Request;

class UserPasswordController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:user_password_list',      ['only' => ['listFromUser']]);
        $this->middleware('permission:user_password_list_mine', ['only' => ['listCurrentUser']]);
        $this->middleware('permission:user_password_create',    ['only' => ['store']]);
        $this->middleware('permission:user_password_update',    ['only' => ['update']]);
        $this->middleware('permission:user_password_delete',    ['only' => ['destroy']]);

        $this->middleware('currentUser', ['only' => 'listCurrentUser']);
    }

    /**
     * Return passwords from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listFromUser($id)
    {
        $data = UserPassword::where('user_id', $id);

        return tableListResponse($data);
    }

    /**
     * Return passwords from current users
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listCurrentUser()
    {
        $data = UserPassword::where('user_id', Input::get('user_id'));

        return tableListResponse($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = UserPassword::create($request->all());

            return createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $data = UserPassword::findOrFail($id);
            $data->fill($request->all());
            $data->save();

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = UserPassword::findOrFail($id);
            $data->delete();

            return deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
