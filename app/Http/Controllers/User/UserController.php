<?php namespace App\Http\Controllers\User;

use App\Models\User\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\Rest\RestControllerTrait;

class UserController extends Controller
{
    use RestControllerTrait;

    const MODEL = User::class;

    public function __construct()
    {
        $this->middleware('permission:user_list', ['only' => ['index', 'tableList']]);
        $this->middleware('permission:user_show', ['only' => ['show']]);
        $this->middleware('permission:user_create', ['only' => ['store']]);
        $this->middleware('permission:user_update', ['only' => ['update']]);
        $this->middleware('permission:user_delete', ['only' => ['destroy']]);
    }
}
