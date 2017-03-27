<?php namespace Mercadolivre\Http\Services;

use GuzzleHttp\Client;
use Livepixel\MercadoLivre\Meli;
use Illuminate\Support\Facades\Log;

/**
 * Class Api
 * @package Mercadolivre\Http\Services
 */
class Api
{
    /**
     * API client
     * @var GuzzleHttp\Client
     */
    protected $api;

    /**
     * Set up API client
     */
    public function __construct()
    {
        if (config('mercadolivre.enabled')) {
            $this->api = new Meli(
                config('mercadolivre.api.app_id'),
                config('mercadolivre.api.secret'),
                t('mercadolivre.access_token'),
                t('mercadolivre.refresh_token')
            );
        }
    }

    private function checkApi()
    {
        if (env('APP_ENV') === 'testing')
            return false;

        if (!$this->api) {
            throw new \Exception('Mercadolivre: Api/sessão não iniciada ou inválida');
        }

        return true;
    }

    /**
     * Return refreshed access token
     *
     * @return void
     */
     public function getRefreshToken()
     {
         if (!$this->checkApi()) return null;

         try {
 			return $this->api->refreshAccessToken();
 		} catch (\Exception $e) {
 		  	\Log::error('Não foi possível atualizar o token de autenticação do Mercado Livre');
 		}
     }

    /**
     * Return auth URL
     *
     * @return string
     */
    public function getAuthUrl()
    {
        if (!$this->checkApi()) return null;

        try {
            return $this->api->getAuthUrl(
                config('mercadolivre.api.callback_url'),
                Meli::$AUTH_URL['MLB']
            );
        } catch (\Exception $e) {
            Log::error('Não foi possível gerar a URL de autenticação com o Mercado Livre');
        }
    }

    /**
     * Return auth URL
     *
     * @return array
     */
    public function getTokenFromCallbackCode($code)
    {
        if (!$this->checkApi()) return null;

        try {
            return $this->api->authorize(
                $code,
                config('mercadolivre.api.callback_url')
            );
        } catch (\Exception $e) {
            Log::error('Não foi possível processar o retorno da autenticação com o Mercado Livre');
        }
    }

    /**
     * Publish ad
     *
     * @param  array $ad
     * @return array
     */
    public function publishAd($ad)
    {
        if (!$this->checkApi()) return null;

        try {
            return $this->api->post('/items', $ad, [
                'access_token' => t('mercadolivre.access_token')
            ]);
        } catch (\Exception $e) {
            Log::error('Não foi possível publicar o anúncio no Mercado Livre');
        }
    }

    /**
     * Sync ad general information
     *
     * @param  string $code
     * @param  array $ad
     * @return array
     */
    public function syncAd($code, $ad)
    {
        if (!$this->checkApi()) return null;

        try {
            $response = $this->api->put("/items/{$code}", $ad, [
                'access_token' => t('mercadolivre.access_token')
            ]);

            if ($response['httpCode'] !== 200) {
                throw new \Exception((is_object($response['body'])) ? $response['body']->message : 'Erro desconhecido');
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('Não foi possível atualizar o anúncio no Mercado Livre: ' . $e->getMessage() . $e->getLine());
            return false;
        }
    }

    /**
     * Sync ad description
     *
     * @param  string $code
     * @param  string $description
     * @return array
     */
    public function syncDescription($code, $description)
    {
        if (!$this->checkApi()) return null;

        try {
            $response = $this->api->put("/items/{$code}/description", [
                'text' => $description
            ], [
                'access_token' => t('mercadolivre.access_token')
            ]);

            if ($response['httpCode'] !== 200) {
                throw new \Exception((is_object($response['body'])) ? $response['body']->message : 'Erro desconhecido');
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('Não foi possível atualizar a descrição do anúncio no Mercado Livre: ' . $e->getMessage() . $e->getLine());
            return false;
        }
    }

    /**
     * Sync ad stock
     *
     * @param  string $code
     * @param  int $stock
     * @return array|boolean
     */
    public function syncStock($code, $stock)
    {
        if (!$this->checkApi()) return null;

        try {
            $response = $this->api->put("/items/{$code}", [
                'available_quantity' => ($stock > 0) ? $stock : 1
            ], [
                'access_token' => t('mercadolivre.access_token')
            ]);

            if ($response['httpCode'] !== 200) {
                throw new \Exception((is_object($response['body'])) ? $response['body']->message : 'Erro desconhecido');
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('Não foi possível atualizar o estoque do anúncio no Mercado Livre: ' . $e->getMessage() . $e->getLine());
            return false;
        }
    }

    /**
     * Sync ad status
     *
     * @param  string $code
     * @param  string $status
     * @return array|boolean
     */
    public function syncStatus($code, $status)
    {
        if (!$this->checkApi()) return null;

        try {
            $response = $this->api->put("/items/{$code}", [
                'status' => $status
            ], [
                'access_token' => t('mercadolivre.access_token')
            ]);

            if ($response['httpCode'] !== 200) {
                throw new \Exception((is_object($response['body'])) ? $response['body']->message : 'Erro desconhecido');
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('Não foi possível atualizar o status do anúncio no Mercado Livre: ' . $e->getMessage() . $e->getLine());
            return false;
        }
    }

    /**
     * Sync ad type
     *
     * @param  string $code
     * @param  string $type
     * @return array|boolean
     */
    public function syncType($code, $type)
    {
        if (!$this->checkApi()) return null;

        try {
            $response = $this->api->post("/items/{$code}/listing_type", [
                'id' => $type
            ], [
                'access_token' => t('mercadolivre.access_token')
            ]);

            if ($response['httpCode'] !== 200) {
                throw new \Exception((is_object($response['body'])) ? $response['body']->message : 'Erro desconhecido');
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('Não foi possível atualizar o tipo do anúncio no Mercado Livre: ' . $e->getMessage() . $e->getLine());
            return false;
        }
    }
}
