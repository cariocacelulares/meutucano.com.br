<?php namespace Mercadolivre\Http\Controllers;

use Core\Models\Produto;
use Mercadolivre\Models\Ad;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Mercadolivre\Http\Services\Api;
use Illuminate\Support\Facades\Input;
use Mercadolivre\Transformers\AdTransformer;
use App\Http\Controllers\Rest\RestControllerTrait;
use Mercadolivre\Http\Requests\AdRequest as Request;
use Mercadolivre\Http\Controllers\Traits\CheckExpiredToken;

class AdController extends Controller
{
    use RestControllerTrait,
        CheckExpiredToken;

    const MODEL = Ad::class;

    /**
     * List products with ads
     * @return Response
     */
    public function groupedList()
    {
        $list = Produto::with('mercadolivreAds')
            ->orderBy('produtos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(AdTransformer::tableList($list));
    }

    /**
     * Create a new resource
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request, Api $api)
    {
        try {
            $ad = Ad::create(Input::all());

            if ($mercadolivreAd = $this->publishAd($api, $ad)) {
                $ad->status    = 1;
                $ad->code      = $mercadolivreAd['code'];
                $ad->permalink = $mercadolivreAd['permalink'];
                $ad->save();

                if ($ad->product->estoque < 1) {
                    $api->syncStock($ad->code, 0);
                }
            }

            return $this->createdResponse($ad);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'error'     => true,
                'message'   => 'Não foi possível salvar o anúncio!',
                'exception' => $e->getMessage() . ' ' . $e->getLine()
            ]);
        }
    }

    /**
     * Publish Ad to Mercado Livre
     *
     * @param  Ad     $ad
     * @return array|bool
     */
    protected function publishAd(Api $api, Ad $ad)
    {
        try {
            $mercadolivreAd = [
                "title"              => $ad->title,
                "category_id"        => $ad->category_id,
                "price"              => $ad->price,
                "currency_id"        => "BRL",
                "available_quantity" => $ad->product->estoque,
                "buying_mode"        => "buy_it_now",
                "listing_type_id"    => ($ad->type == 0) ? 'gold_special' : 'gold_pro',
                "condition"          => ($ad->product->estado == 0) ? 'new' : 'used',
                "description"        => "Teste Tucano", // TODO: Template
                "video_id"           => "D78GMh4dCbk", //TODO: Vídeo
                "warranty"           => $ad->product->warranty,
                "shipping"           => [
                    "mode"          => "me2",
                    "local_pick_up" => false,
                    "free_shipping" => ($ad->shipping == 1),
                    "free_methods"  => ($ad->shipping == 1) ? [
                        [
                            "id"   => 100009,
                            "rule" => [
                                "free_mode" => "country",
                                "value"     => null
                            ]
                        ]
                    ] : []
                ],
                "pictures"           => [
                    ["source" => "https://s3-sa-east-1.amazonaws.com/cariocacelulares/catalog/product/s/m/smartphone_apple_iphone_5_e_5s_cinza_16gb_32gb_4g_ios_8mp_tela_4_2.jpg"],
                    ["source" => "https://s3-sa-east-1.amazonaws.com/cariocacelulares/catalog/product/s/m/smartphone_apple_iphone_5_e_5s_cinza_16gb_32gb_4g_ios_8mp_tela_4a_2.jpg"],
                    ["source" => "https://s3-sa-east-1.amazonaws.com/cariocacelulares/catalog/product/s/m/smartphone_apple_iphone_5_e_5s_cinza_16gb_32gb_4g_ios_8mp_tela_4a_2.jpg"]
                ] // TODO: Imagens
            ];

            $response = $api->publishAd($mercadolivreAd);

            if ($response['httpCode'] !== 201) {
                throw new \Exception($response['body']->message, 1);
            }

            return [
                'code'      => $response['body']->id,
                'permalink' => $response['body']->permalink
            ];
        } catch (\Exception $e) {
            \Log::warning(logMessage($e, 'Não foi possível cadastrar o anúncio no Mercado Livre'));

            return false;
        }
    }

    /**
     * Sync Ad to Mercado Livre
     *
     * @param  Api    $api
     * @param  Ad     $ad
     * @return boolean
     */
    public function syncAd(Api $api, Ad $ad)
    {
        try {
            $mercadolivreAd = [
                "title"              => $ad->title,
                "price"              => $ad->price,
                "condition"          => ($ad->product->estado == 0) ? 'new' : 'used',
                "video_id"           => "D78GMh4dCbk", //TODO: Vídeo
                "warranty"           => $ad->product->warranty,
                "shipping"           => [
                    "mode"          => "me2",
                    "local_pick_up" => false,
                    "free_shipping" => ($ad->shipping == 1),
                    "free_methods"  => ($ad->shipping == 1) ? [
                        [
                            "id"   => 100009,
                            "rule" => [
                                "free_mode" => "country",
                                "value"     => null
                            ]
                        ]
                    ] : []
                ],
                "pictures"           => [
                    ["source" => "https://s3-sa-east-1.amazonaws.com/cariocacelulares/catalog/product/s/m/smartphone_apple_iphone_5_e_5s_cinza_16gb_32gb_4g_ios_8mp_tela_4_2.jpg"],
                    ["source" => "https://s3-sa-east-1.amazonaws.com/cariocacelulares/catalog/product/s/m/smartphone_apple_iphone_5_e_5s_cinza_16gb_32gb_4g_ios_8mp_tela_4a_2.jpg"],
                    ["source" => "https://s3-sa-east-1.amazonaws.com/cariocacelulares/catalog/product/s/m/smartphone_apple_iphone_5_e_5s_cinza_16gb_32gb_4g_ios_8mp_tela_4a_2.jpg"]
                ] // TODO: Imagens
            ];

            $response = $api->syncAd($ad->code, $mercadolivreAd);

            return true;
        } catch (\Exception $e) {
            \Log::warning(logMessage($e, 'Não foi possível atualizar o anúncio no Mercado Livre'));

            return false;
        }
    }

    /**
     * Update a resource
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update(Request $request, Api $api, $id)
    {
        try {
            $ad = Ad::findOrFail($id);
            $ad->fill(Input::all());

            if (!$this->syncAd($api, $ad)) {
                throw new \Exception("Não foi possível atualizar o anúncio");
            }

            if ($ad->isDirty('type')) {
                sleep(1);
                if (!$api->syncType($ad->code, $ad->type_description)) {
                    throw new \Exception("Não foi possível atualizar o tipo do anúncio");
                }
            }

            if ($ad->isDirty('template_id') || $ad->isDirty('template_custom')) {
                sleep(1);
                if (!$api->syncDescription($ad->code, $this->getAdDescription($ad))) {
                    throw new \Exception("Não foi possível atualizar a descrição do anúncio");
                }
            }

            $ad->save();

            return $this->showResponse($ad);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Deletes a resource
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy(Api $api, $id)
    {
        try {
            $ad = Ad::findOrFail($id);

            if (!$api->syncStatus($ad->code, 'paused')) {
                throw new \Exception("Não foi possível pausar o anúncio");
            }

            $ad->delete();
            return $this->deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Update stock based on product SKU
     *
     * @param  Api    $api
     * @param  int $sku
     * @return boolean
     */
    public function updateStockByProduct($product)
    {
        // dd($product);
        try {
            $product = Produto::findOrFail($sku);


        } catch (\Exception $e) {
            \Log::error(logMessage($e, 'Erro ao atualizar estoque do anúncio'));
            return false;
        }
    }

    /**
     * Update ad status
     *
     * @param  Api    $api
     * @param  string $id
     * @param  string $status
     * @return boolean
     */
    protected function updateAdStatus(Api $api, $id, $status)
    {
        try {
            $ad = Ad::findOrFail($id);

            if (!$api->syncStatus($ad->code, $status)) {
                throw new \Exception("Não foi alterar o status do anúncio para {$status}");
            }

            $ad->status = ($status == 'active') ? 1 : 2;
            $ad->save();

            return $this->showResponse($ad);
        } catch (\Exception $e) {
            \Log::error(logMessage($e, 'Erro ao atualizar status do anúncio'));
            return $this->clientErrorResponse([
                'error' => true,
                'message' => 'Erro ao atualizar status do anúncio',
                'exception' => $e->getMessage() . ' ' . $e->getLine()
            ]);
        }
    }

    /**
     * Set ad as paused
     *
     * @param  Api    $api
     * @param  string $id
     * @return void
     */
    public function pauseAd(Api $api, $id)
    {
        return $this->updateAdStatus($api, $id, 'paused');
    }

    /**
     * Set ad as active
     *
     * @param  Api    $api
     * @param  string $id
     * @return void
     */
    public function activateAd(Api $api, $id)
    {
        return $this->updateAdStatus($api, $id, 'active');
    }


    /**
     * Sync full ad information with Mercado Livre
     *
     * @param  Api    $api [description]
     * @param  int $id
     * @return boolean
     */
    public function fullSyncAd(Api $api, $id)
    {

    }

    /**
     * Return ideal description from ad
     *
     * @param  Ad     $ad
     * @return string
     */
    protected function getAdDescription(Ad $ad)
    {
        return $ad->template_custom;
    }
}
