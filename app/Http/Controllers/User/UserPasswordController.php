<?php namespace App\Http\Controllers\User;

use App\Models\User\UserPassword;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
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
        $this->middleware('convertJson', ['only' => ['listFromUser', 'listCurrentUser']]);
    }

    /**
     * Return passwords from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listFromUser($id)
    {
        $search = request('search');

        $data = UserPassword::where('user_id', $id)
            ->where(function($query) use ($search) {
                $query->where('description', 'LIKE', "%{$search}%")
                    ->orWhere('url', 'LIKE', "%{$search}%");
            })
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * Return passwords from current users
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listCurrentUser()
    {
        $search = request('search');

        $data = UserPassword::where('user_id', request('user_id'))
            ->where(function($query) use ($search) {
                $query->where('description', 'LIKE', "%{$search}%")
                    ->orWhere('url', 'LIKE', "%{$search}%");
            })
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
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
