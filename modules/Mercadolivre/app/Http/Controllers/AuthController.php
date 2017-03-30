<?php namespace Mercadolivre\Http\Controllers;

use Core\Models\Produto;
use Mercadolivre\Models\Ad;
use Illuminate\Routing\Controller;
use Mercadolivre\Http\Services\Api;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use Mercadolivre\Http\Controllers\Traits\CheckExpiredToken;

class AuthController extends Controller
{
    use RestResponseTrait,
        CheckExpiredToken;

    /**
     * Return auth url
     *
     * @param  Api   $api
     * @return Response
     */
    public function authUrl(Api $api)
    {
        if (t('mercadolivre.access_token')) {
            return $this->showResponse(['url' => false]);
        }

        return $this->showResponse(['url' => $api->getAuthUrl()]);
    }

    /**
     * Handle callback from auth
     *
     * @param  Api   $api
     * @return void
     */
    public function callback(Api $api)
    {
        $token = $api->getTokenFromCallbackCode(Input::get('code'));

        t('mercadolivre.access_token',  $token['body']->access_token);
        t('mercadolivre.refresh_token', $token['body']->refresh_token);
        t('mercadolivre.expires',       time() + $token['body']->expires_in);

        return redirect()->to(config('mercadolivre.api.redirect_url'));
    }
}
