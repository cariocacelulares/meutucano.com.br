<?php namespace App\Http\Controllers;

use App\Models\User\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest as Request;

class PermissionController extends Controller
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
        $data = Permission::with('roles')->get();

        return listResponse($data);
    }
}
