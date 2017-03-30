<?php namespace Mercadolivre\Http\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

/**
 * Class PublicApi
 * @package Mercadolivre\Http\Services
 */
class PublicApi
{
    /**
     * API client
     * @var GuzzleHttp\Client
     */
    protected $api;

    /**
     * Create API Client
     */
    public function __construct() {
        $this->api = new \GuzzleHttp\Client([
            'base_uri' => config('mercadolivre.api.url'),
            'headers'  => [
                "Accept"         => "application/json",
                "Content-type"   => "application/json"
            ]
        ]);
    }

    /**
     * Make request to Mercado Livre API
     *
     * @param  string $method
     * @param  string $url
     * @param  array $params
     * @return string|array
     */
    private function request($method, $url, $params = []) {
        $r = $this->api->request($method, $url, $params);
        return json_decode($r->getBody(), true);
    }

    /**
     * Fetch all categories
     *
     * @return array
     */
    public function getAllCategories()
    {
        try {
            return $this->request('GET', '/sites/MLB/categories');
        } catch (\Exception $e) {
            Log::error('Impossível realizar a busca de categorias do Mercado Livre.');
        }
    }

    /**
     * Fetch category by id
     *
     * @param  string $id
     * @return array
     */
    public function getCategoryById($id)
    {
        try {
            return $this->request('GET', "/categories/{$id}");
        } catch (\Exception $e) {
            Log::error('Impossível realizar a busca de subcategorias do Mercado Livre.');
        }
    }

    /**
     * Fetch category by predict
     *
     * @param string $title
     * @return array
     */
    public function getCategoryByPredict($title)
    {
        try {
            return $this->request('GET', "/sites/MLB/category_predictor/predict?title=$title");
        } catch (\Exception $e) {
            Log::error('Impossível realizar a busca de categoria por predict do Mercado Livre.');
        }
    }


}
