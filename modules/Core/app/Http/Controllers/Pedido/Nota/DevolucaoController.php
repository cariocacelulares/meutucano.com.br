<?php namespace Core\Http\Controllers\Pedido\Nota;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto;
use Core\Models\Produto\Defect;
use Core\Models\Produto\ProductImei;
use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Nota\Devolucao;
use Core\Models\Stock\Removal;
use Core\Models\Stock\RemovalProduct;
use Core\Http\Controllers\Partials\Traits\Uploadable;

/**
 * Class DevolucaoController
 * @package Core\Http\Controllers\Pedid\Nota
 */
class DevolucaoController extends Controller
{
    use RestControllerTrait,
        Uploadable;

    const MODEL = Devolucao::class;

    /**
     * Proceed with upload (created defects and change order status)
     *
     * @param  int  $id Devolucao
     * @return Response
     */
    public function proceed($id)
    {
        try {
            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $devolucao = (self::MODEL)
                ::findOrFail($id);

            $cancelOrder = Input::get('cancelOrder');
            if ($cancelOrder) {
                $pedido = $devolucao->nota->pedido;
                $pedido->status = 5;
                $pedido->save();
            }

            $products = Input::get('products');
            foreach ($products as $product) {
                if ($product['defect']) {
                    if (!$product['desc']) {
                        return $this->validationFailResponse([
                            "O produto {$product['sku']} não possui uma descrição no defeito"
                        ]);
                    }

                    if (!Produto::find($product['sku'])) {
                        return $this->validationFailResponse([
                            "O SKU {$product['sku']} não foi encontrado"
                        ]);
                    }

                    $productImei = ProductImei
                        ::where('imei', '=', $product['imei'])
                        ->withTrashed()
                        ->first();

                    if (!$productImei) {
                        return $this->validationFailResponse([
                            "O serial {$product['imei']} não foi encontrado"
                        ]);
                    }

                    Defect::create([
                        'product_sku'     => $product['sku'],
                        'product_imei_id' => $productImei->id,
                        'description'     => $product['desc'],
                    ]);

                    $removal = Removal::firstOrCreate([
                        'user_id'       => getCurrentUserId(),
                        'is_continuous' => true,
                        'closed_at'     => null,
                    ]);

                    RemovalProduct::create([
                        'stock_removal_id' => $removal->id,
                        'product_stock_id' => $productImei->productStock->id,
                        'product_imei_id'  => $productImei->id,
                        'status'           => 1,
                    ]);
                }
            }

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');
        } catch (\Exception $exception) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::alert(logMessage($exception, 'Erro ao proceder o upload da nota de devolução'));

            return $this->clientErrorResponse([
                'Erro ao proceder o upload da nota de devolução'
            ]);
        }

        return $this->showResponse(true);
    }

    /**
     * Call trait method to prepare upload
     *
     * @return Response
     */
    public function upload()
    {
        return $this->uploadOnce(Input::file('file'));
    }

    /**
     * Process all data to import info to invoice order
     *
     * @param  string $fileName name of UploadedFile
     * @return bool|array       return of process
     */
    public function processUpload($fileName)
    {
        try {
            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $imeis     = $this->getImeis();
            $devolucao = $this->importDevolucao($fileName);

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            return [
                'devolucao' => $devolucao,
                'products'  => $imeis,
            ];
        } catch (\Exception $exception) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::alert(logMessage($exception, 'Não foi possível fazer upload do arquivo'));

            if ($exception->getCode() == 7) {
                return $exception->getMessage();
            } else {
                return 'Erro desconhecido!';
            }
        }
    }

    /**
     * Import devolution by invoice
     *
     * @param string $fileName
     * @return boolean
     */
    private function importDevolucao($fileName)
    {
        $userId = getCurrentUserId();
        $key    = (string) $this->protNfe->infProt->chNFe;

        $cfop = (int) $this->getProducts()[0]->prod->CFOP;
        $tipoOperacao = null;
        if (in_array($cfop, Config::get('core.notas.devolucao'))) {
            $tipoOperacao = 'devolucao';
        } elseif (in_array($cfop, Config::get('core.notas.estorno'))) {
            $tipoOperacao = 'estorno';
        } else {
            throw new \Exception('CFOP inválido para devolução!', 7);
        }

        // Data
        $dateTime = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $this->nfe->ide->dhEmi);
        $date     = $dateTime->format('Y-m-d');

        $parent = null;
        if ($ref = $this->nfe->ide->NFref->refNFe) {
            $parent = Nota::withTrashed()->where('chave', '=', $ref)->first();
        }

        if (!$parent) {
            throw new \Exception('Não foi possível encontrar a nota de referência para a devolução', 7);
        }

        $devolucao = Devolucao::firstOrNew([
            'chave'   => $key,
            'nota_id' => $parent->id
        ]);
        $devolucao->usuario_id = $userId;
        $devolucao->nota_id    = $parent->id;
        $devolucao->chave      = $key;
        $devolucao->arquivo    = $fileName;
        $devolucao->tipo       = ($tipoOperacao == 'estorno') ? 1 : 0;
        $devolucao->data       = $date;

        if ($devolucao->save()) {
            Log::info('Devolução de nota importada ' . $devolucao->id);
        } else {
            Log::warning('Não foi possível importar a devolução da nota de venda: ' . $parent->id);

            return false;
        }

        return $devolucao;
    }

    /**
     * Extract and verify imeis from invoice
     *
     * @return {array} list of imeis and product info
     */
    private function getImeis()
    {
        $infCpl = (string) $this->nfe->infAdic->infCpl;

        // Pega as posicoes dos seriais no rodape da nota
        $lastPos   = 0;
        $positions = [];
        while (($lastPos = stripos($infCpl, 'PROD.:', $lastPos)) !== false) {
            $positions[] = $lastPos;
            $lastPos     = $lastPos + strlen('PROD.:');
        }

        $imeis = [];
        foreach ($positions as $key => $pos) {
            $posFind = ' | ';

            $lineProduto = substr($infCpl, $pos, (stripos($infCpl, $posFind, $pos) - $pos));
            $skuProduto  = (int)substr($lineProduto, stripos($lineProduto, '.: ') + 3, 5);
            $imei        = trim(substr($lineProduto, stripos($lineProduto, 'S/N') + 5));

            if ($imei) {
                // verif'ica cada imei, se realmente pertece ao produto
                foreach (explode(',', $imei) as $imei) {
                    $imei = trim($imei);

                    $productImei = ProductImei::where('imei', '=', $imei)->first();

                    if (!$productImei) {
                        throw new \Exception("O imei {$imei} não foi encontrado.", 7);
                    }

                    if ($productImei->productStock->product_sku != $skuProduto) {
                        throw new \Exception("O imei {$imei} está registrado no produto {$productImei->productStock->product_sku} e não no {$skuProduto}.", 7);
                    }

                    $imeis[] = [
                        'sku'    => $skuProduto,
                        'imei'   => trim($imei),
                        'titulo' => $productImei->productStock->product->titulo,
                        'defect' => false,
                        'desc'   => null,
                    ];
                }
            }
        }

        return $imeis;
    }
}
