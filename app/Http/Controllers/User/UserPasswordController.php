<?php namespace App\Http\Controllers\User;

use App\Models\User\UserPassword;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;

class UserPasswordController extends Controller
{
    use RestControllerTrait;

    const MODEL = UserPassword::class;

    public function __construct()
    {
        $this->middleware('permission:user_password_list',      ['only' => ['index', 'listFromUser', 'show']]);
        $this->middleware('permission:user_password_list_mine', ['only' => ['listCurrentUser']]);
        $this->middleware('permission:user_password_create',    ['only' => ['store']]);
        $this->middleware('permission:user_password_update',    ['only' => ['update']]);
        $this->middleware('permission:user_password_delete',    ['only' => ['destroy']]);
    }

    /**
     * Return passwords from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listFromUser($id)
    {
        return $this->listResponse($this->listPasswords($id));
    }

    /**
     * Return passwords from current users
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listCurrentUser()
    {
        $id = JWTAuth::parseToken()->authenticate()->id;

        return $this->listResponse($this->listPasswords($id));
    }

    /**
     * Reutn passwords form user
     *
     * @param  int $user_id
     * @return Object
     */
    private function listPasswords($user_id)
    {
        $list = UserPassword::where('user_id', $user_id);

        return $this->handleRequest($list);
    }
}
