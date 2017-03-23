<?php namespace Mercadolivre\Http\Controllers\Traits;

use Mercadolivre\Http\Services\Api;

trait CheckExpiredToken {

    /**
     * Check if token is expired
     *
     * @param Api $api
     */
    public function __construct(Api $api)
    {
        $expireTime = t('mercadolivre.expires');
        if ($expireTime && $expireTime < time()) {
            $this->refresh($api);
        }
    }

    /**
     * Refresh expired token
     *
     * @param  Api   $api
     * @return void
     */
    public function refresh(Api $api)
    {
        try {
			$token = $api->getRefreshToken();

            t('mercadolivre.access_token',  $token['body']->access_token);
            t('mercadolivre.refresh_token', $token['body']->refresh_token);
            t('mercadolivre.expires',       time() + $token['body']->expires_in);
		} catch (\Exception $e) {
		  	\Log::error('Não foi possível atualizar o token de autenticação do Mercado Livre');
		}
    }
}
