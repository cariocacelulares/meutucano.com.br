<?php namespace App\Http\Controllers\User;

use App\Models\User\User;
use App\Models\User\Role;
use App\Models\User\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest as Request;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:user_list')->only(['index']);
        $this->middleware('permission:user_show')->only(['show']);
        $this->middleware('permission:user_create')->only(['store']);
        $this->middleware('permission:user_update')->only(['update']);
        $this->middleware('permission:user_delete')->only(['destroy']);

        $this->middleware('convertJson')->only(['index', 'store']);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = User::orderBy('id')
            ->where(function($query) use ($search) {
                $query->where('email', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
            })
            ->where(function($query) {
                if (request('filter.active') !== null)
                    $query->where('active', request('filter.active'));
            })
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fetch()
    {
        $search = request('search');

        $data = User::where('name', 'LIKE', "%{$search}%")
            ->where('active', true)
            ->get();

        return listResponse($data);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = User::findOrFail($id);
            $data->append('permissions');

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = User::create($request->all());

            $this->syncRolesAndPermissions($data, $request);

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
            $data = User::findOrFail($id);
            $data->fill($request->all());
            $data->save();

            $this->syncRolesAndPermissions($data, $request);

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Update roles and permissions from user
     *
     * @param  User $user
     * @param  Request $request
     * @return void
     */
    private function syncRolesAndPermissions($user, $request)
    {
        if ($roleIds = $request->input('roles')) {
            $roles = Role::whereIn('id', $roleIds)->get();
            $user->roles()->delete();
            $user->roles()->saveMany($roles);
        }

        if ($permissionIds = $request->input('permissions')) {
            $permissions = Permission::whereIn('id', $permissionIds)->get();
            $user->perms()->delete();
            $user->perms()->saveMany($permissions);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = User::findOrFail($id);
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
