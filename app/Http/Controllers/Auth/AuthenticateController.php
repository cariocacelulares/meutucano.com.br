<?php namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use JWTAuth;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

/**
 * Class AuthenticateController
 * @package App\Http\Controllers\Auth
 */
class AuthenticateController extends Controller
{
    /**
     * Autentica usuário
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->only('username', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials', 'msg' => 'Usuário ou senha inválido(s).'], 401);
            }
        } catch (JWTException $e) {
            \Log::alert(logMessage($e, 'Erro ao criar token'));

            return response()->json(['error' => 'could_not_create_token', 'msg' => 'Erro ao criar token, avise o administrador.'], 500);
        }

        return response()->json(compact('token'));
    }

    /**
     * Retorna o usuário autenticado
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthenticatedUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }

    /**
     * Atualiza o token do JWT
     *
     * @return mixed
     * @throws AccessDeniedHttpException
     * @throws BadRequestHttpException
     */
    public function refreshToken()
    {
        $token = JWTAuth::getToken();
        if (!$token) {
            return response()->json(['token_absent'], 500);
        }
        try {
            $token = JWTAuth::refresh($token);
        } catch(TokenInvalidException $e) {
            return response()->json(['token_invalid'], 400);
        } catch(TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        }

        return response()->json(compact('token'));
    }
}
