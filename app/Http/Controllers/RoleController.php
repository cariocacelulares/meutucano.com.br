<?php namespace App\Http\Controllers;

use App\Models\User\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest as Request;

class RoleController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:user_update');
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = Role::with('perms')->get();

        return listResponse($data);
    }
}
