<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Http\Controllers\Partials\Traits\Uploadable;
use Core\Models\Pedido;
use Core\Models\Pedido\Imposto;
use Core\Models\Pedido\Nota;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Models\Produto;
use Core\Models\Produto\ProductImei;
use Core\Models\Produto\ProductStock;
use Core\Models\Stock\RemovalProduct;
use Rastreio\Models\Rastreio;

/**
 * Class UploadController
 * @package Core\Http\Controllers\Pedido
 */
class UploadController extends Controller
{
    use RestControllerTrait,
        Uploadable;

    /**
     * If order invoice is from a marketplace
     */
    protected $isMarketplace;

    /**
     * Call trait method to prepare upload
     *
     * @return Response
     */
    public function upload()
    {
        return $this->uploadMultiple(Input::file('files'));
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
            $cfop = (int) $this->getProducts()[0]->prod->CFOP;
            $key  = (string) $this->protNfe->infProt->chNFe;

            if (!in_array($cfop, Config::get('core.notas.venda'))) {
                return 'CFOP da nota não é compatível com essa operação!';
            }

            $dateTime = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $this->nfe->ide->dhEmi);

            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            if (strstr(strtolower($this->nfe->infAdic->infCpl), 'b2w') || strstr(strtolower($this->nfe->infAdic->infCpl), 'cnova')) {
                $this->isMarketplace = true;
            } else {
                $this->isMarketplace = false;
            }

            $order    = $this->importOrder($key, $cfop);
            $invoice  = $this->importInvoice($key, $order, $fileName, $dateTime);
            $rastreio = $this->importRastreio($order, $dateTime);
            $taxation = $this->importTaxation($order, $dateTime);
            $products = $this->importProducts($order);
            $this->sendEmailNotification($products, $order, $rastreio, $invoice);

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            $nota     = Nota::where('pedido_id', '=', $order->id)->orderBy('created_at', 'DESC')->first();
            $rastreio = Rastreio::where('pedido_id', '=', $order->id)->orderBy('created_at', 'DESC')->first();

            return [
                'id'                 => $order->id,
                'codigo_marketplace' => $order->codigo_marketplace,
                'cliente'            => $order->cliente->nome,
                'can_invoice'        => ($nota && !$order->segurado && (int)$order->status === 1),
                'nota_id'            => ($nota) ? $nota->id : null,
                'rastreio_id'        => ($rastreio) ? $rastreio->id : null,
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

        return false;
    }

    /**
     * Validate and import all products
     *
     * @param  Pedido $order
     * @return void
     */
    private function importProducts($order)
    {
        $reenvio = strstr($this->nfe->infAdic->infCpl, 'REENVIO') ? true : false;

        // Pega as posicoes dos seriais no rodape da nota
        $lastPos   = 0;
        $positions = [];
        while (($lastPos = stripos($this->nfe->infAdic->infCpl, 'PROD.:', $lastPos)) !== false) {
            $positions[] = $lastPos;
            $lastPos     = $lastPos + strlen('PROD.:');
        }

        // Separa os imeis por produto
        $imeis = [];
        foreach ($positions as $key => $pos) {
            $posFind = ' | ';
            if ((sizeof($positions) - 1) == $key) {
                $posFind = '-';
            }

            $lineProduto = substr($this->nfe->infAdic->infCpl, $pos, (stripos($this->nfe->infAdic->infCpl, $posFind, $pos) - $pos));
            $skuProduto  = (int)substr($lineProduto, stripos($lineProduto, '.: ') + 3, 5);
            $imei        = trim(substr($lineProduto, stripos($lineProduto, 'S/N') + 5));

            // verifica cada imei, se realmente pertece ao produto e se está adequado para ser faturado
            foreach (explode(',', $imei) as $imei) {
                $imei = trim(str_replace([',', '.', '|', '/'], '', $imei));

                $productImei = ProductImei::where('imei', '=', $imei)->first();

                if (!$productImei) {
                    throw new \Exception("O imei {$imei} não foi encontrado.", 7);
                }

                if ($productImei->productStock->product_sku != $skuProduto) {
                    throw new \Exception("O imei {$imei} está registrado no produto {$productImei->productStock->product_sku} e não no {$skuProduto}.", 7);
                }

                $removalProducts = RemovalProduct
                    ::join('stock_removals', 'stock_removals.id', 'stock_removal_products.stock_removal_id')
                    ->whereNull('stock_removals.closed_at')
                    ->where('product_imei_id', '=', $productImei->id)
                    ->orderBy('stock_removals.created_at', 'DESC')
                    ->get(['stock_removal_products.*']);

                if ($removalProducts->isEmpty()) {
                    throw new \Exception("O imei {$imei} não tem registro de retirada de estoque", 7);
                } else {
                    foreach ($removalProducts as $removalProduct) {
                        if ($removalProduct->status === 0) {
                            throw new \Exception("O imei {$imei} não teve confirmação na retirada de estoque", 7);
                        } else if ($removalProduct->status === 3) {
                            throw new \Exception("O imei {$imei} consta como devolvido na retirada de estoque", 7);
                        } else if ($removalProduct->status === 1) {
                            // altera o status do imei na retirada de estoque
                            $removalProduct->status = 2;
                            $removalProduct->save();
                        }
                    }
                }

                $imeis[$skuProduto][] = trim($imei);
            }
        }

        // Organiza os produtos da nota
        $produtosNota = [];
        foreach ($this->getProducts() as $product) {
            $sku = (int)   $product->prod->cProd;
            $qty = (float) $product->prod->qCom;

            $produtosNota[$sku] = [
                'sku'        => $sku,
                'titulo'     => (string) $product->prod->xProd,
                'ncm'        => (string) $product->prod->NCM,
                'ean'        => (string) $product->prod->cEAN,
                'quantidade' => isset($produtosNota[$sku]) ? ($qty + $produtosNota[$sku]['quantidade']) : $qty,
                'valor'      => (string) $product->prod->vUnCom,
            ];
        }

        $utilizados  = [];
        $cadastrados = [];
        foreach ($produtosNota as $sku => $produtoNota) {
            $qtyImeis = count($imeis[$sku]);

            if ($produtoNota['quantidade'] != $qtyImeis) {
                throw new \Exception("O produto {$sku} tem {$produtoNota['quantidade']} quantidade(s) mas só existe(m) {$qtyImeis} na nota", 1);
            }

            $product = Produto::find($sku);

            if (!$product) {
                throw new \Exception("O produto com SKU {$sku} não foi encontrado no tucano.", 7);
            }

            for ($i=0; $i < $produtoNota['quantidade']; $i++) {
                // Pega o pedidoProduto
                $orderProduct = PedidoProduto
                    ::where('pedido_id', '=', $order->id)
                    ->where('produto_sku', '=', $product->sku)
                    ->where('valor', '=', $produtoNota['valor'])
                    ->whereNotIn('id', $utilizados)
                    ->first();

                if ($this->isMarketplace && !$orderProduct) {
                   $orderProduct = PedidoProduto::create([
                       'pedido_id'   => $order->id,
                       'produto_sku' => $product->sku,
                       'valor'       => $produtoNota['valor'],
                   ]);
               }

                if (!$orderProduct) {
                    throw new \Exception("O produto {$sku} está com valor ou quantidade divergente", 1);
                }

                if (empty($imeis[$sku])) {
                    throw new \Exception("Não existem imeis suficientes na nota para o produto {$sku}", 7);
                }

                $productImei = ProductImei::where('imei', '=', $imeis[$sku][0])->first();
                $orderProduct->product_imei_id  = $productImei->id;
                $orderProduct->product_stock_id = $productImei->productStock->id;

                unset($imeis[$sku][0]);
                $imeis[$sku] = array_values($imeis[$sku]);

                if ($orderProduct->save()) {
                    $utilizados[] = $orderProduct->id;
                    $cadastrados[$sku][currencyNumbers($produtoNota['valor'])] = isset($cadastrados[$sku][currencyNumbers($produtoNota['valor'])]) ? ($cadastrados[$sku][currencyNumbers($produtoNota['valor'])] + 1) : 1;
                    Log::info('Pedido Produto importado ' . $sku . ' / ' . $order->id);
                } else {
                    Log::warning('Não foi possível importar o Pedido Produto ' . $sku . ' / ' . $order->id);
                }
            }
        }

        // Produtos que não foram faturados
        $orderProducts = PedidoProduto
            ::where('pedido_id', '=', $order->id)
            ->whereNotIn('id', $utilizados)
            ->get();

        if (count($orderProducts) == 1) {
            throw new \Exception("O produto {$orderProducts[0]->produto_sku} está no pedido mas não está na nota!", 7);
        } else if (count($orderProducts) > 1) {
            $skus = [];
            foreach ($orderProducts as $orderProduct) {
                $skus[] = $orderProduct->produto_sku;
            }
            $skus = implode(', ', $skus);

            throw new \Exception("Os produtos {$skus} estão no pedido mas não estão na nota!", 7);
        }
    }

    /**
     * Send email notification to customer with danfe
     *
     * @param  Pedido $order
     * @param  Rastreio $rastreio
     * @param  Nota $invoice
     * @return void
     */
    private function sendEmailNotification($order, $rastreio, $invoice)
    {
        if ($this->nfe->dest->email) {
            $nome    = (string) $this->nfe->dest->xNome;
            $email   = (string) $this->nfe->dest->email;
            $nota_id = $invoice->id;
            $arquivo = storage_path('app/public/' . date('His') . '.pdf');

            if (\Config::get('core.email_send_enabled')) {
                $mail = \Mail::send('emails.compra', [
                    'nome'     => $this->nfe->dest->xNome,
                    'produtos' => $this->getProducts(),
                    'rastreio' => $rastreio->rastreio
                ], function ($message) use ($nota_id, $email, $nome, $arquivo) {
                    with(new NotaController())->danfe($nota_id, 'F', $arquivo);

                    $message
                        ->attach($arquivo, ['as' => 'nota.pdf', 'mime' => 'application/pdf'])
                        ->to($email)
                        ->subject('Obrigado por comprar na Carioca Celulares On-line');
                });

                if ($mail) {
                    Log::debug('E-mail com a nota enviado para: ' . $email);

                    return true;
                } else {
                    Log::warning('Falha ao enviar e-mail com a nota para: ' . $email);
                }
            } else {
                Log::debug("O e-mail não foi enviado para {$email} pois o envio está desativado (upload)!");
            }

            unlink($arquivo);

            return false;
        }
    }

    /**
     * Import order taxation
     *
     * @param  Pedido $order
     * @return Imposto|false
     */
    private function importTaxation($order)
    {
        $taxation                    = Imposto::findOrNew($order->id);
        $taxation->pedido_id         = $order->id;
        $taxation->icms              = $this->nfe->total->ICMSTot->vICMS;
        $taxation->pis               = $this->nfe->total->ICMSTot->vPIS;
        $taxation->cofins            = $this->nfe->total->ICMSTot->vCOFINS;
        $taxation->icms_destinatario = $this->nfe->total->ICMSTot->vICMSUFDest;
        $taxation->icms_remetente    = $this->nfe->total->ICMSTot->vICMSUFRemet;

        if ($taxation->save()) {
            Log::info('Imposto importado ' . $taxation->id);
        } else {
            Log::warning('Não foi possível importar o imposto do pedido ' . $order->id);

            return false;
        }

        return $taxation;
    }

    /**
     * Import order invoice
     *
     * @param  string $key      invoice key
     * @param  Pedido $order
     * @param  string $fileName
     * @param  string $dateTime
     * @return Nota|false
     */
    private function importInvoice($key, $order, $fileName, $dateTime)
    {
        $nota = Nota::withTrashed()->firstOrNew([
            'pedido_id' => $order->id,
            'chave'     => $key
        ]);

        $nota->pedido_id  = $order->id;
        $nota->usuario_id = getCurrentUserId();
        $nota->data       = $dateTime->format('Y-m-d');
        $nota->chave      = $key;
        $nota->arquivo    = $fileName;
        $nota->deleted_at = null;

        if ($nota->save()) {
            Log::info('Nota importada ' . $nota->id);
        } else {
            Log::warning('Não foi possível importar a nota do pedido ' . $order->id);

            return false;
        }
    }

    /**
     * Import order rastreio
     *
     * @param  Pedido $order
     * @param  stringn $dateTime
     * @return Rastreio|false
     */
    private function importRastreio($order, $dateTime)
    {
        $codRastreio = null;
        preg_match('/([A-Za-z]{2}[0-9]{9}BR)+/', $this->nfe->infAdic->infCpl, $codPost);
        if ($codPost) {
            $codRastreio = strtoupper(substr($codPost[0], 0, 13));
        }

        if ($codRastreio) {
            // Serviço de envio
            $tipoRastreio = substr($codRastreio, 0, 1);
            $metodoEnvio  = null;
            if ($tipoRastreio == 'P') {
                $metodoEnvio = 'PAC';
            } elseif ($tipoRastreio == 'D') {
                $metodoEnvio = 'SEDEX';
            }

            // Valor de frete
            $freteTotal = null;
            if ($posInicial = strpos(strtoupper($this->nfe->infAdic->infCpl), 'FRETE')) {
                preg_match('/[0-9]{2,3}\.[0-9]{2}/', substr($this->nfe->infAdic->infCpl, $posInicial, 40), $frete);

                if ($frete) {
                    $freteTotal = $frete[0];
                }
            }

            // Data de envio
            if ($dateTime->format('w') == '5' && $dateTime->format('H') <= 14) {
                $dataEnvio = $dateTime;
            } else {
                $dataEnvio = $dateTime->add(date_interval_create_from_date_string('+1 day'));
                if ($dataEnvio->format('w') == '6') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+2 day'));
                } elseif ($dataEnvio->format('w') == '0') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+1 day'));
                }
            }

            $dataEnvio = $dataEnvio->format('Y-m-d');

            $rastreio = Rastreio::where('pedido_id', '!=', $order->id)->where('rastreio', '=', $codRastreio)->first();
            if ($rastreio) {
                throw new \Exception('O código de rastreio já está sendo utilizado.', 7);
            }

            $rastreio = Rastreio::firstOrNew([
                'pedido_id' => $order->id,
                'rastreio'  => $codRastreio
            ]);
            $rastreio->pedido_id  = $order->id;
            $rastreio->rastreio   = $codRastreio;
            $rastreio->data_envio = $dataEnvio;
            $rastreio->servico    = $metodoEnvio;
            $rastreio->valor      = $freteTotal;
            $rastreio->prazo      = null;

            if ($rastreio->save()) {
                Log::info('Rastreio importado ' . $rastreio->id);
            } else {
                Log::warning('Não foi possível importar o rastreio do pedido ' . $order->id);

                return false;
            }

            return $rastreio;
        }
    }

    /**
     * Import order
     *
     * @param  string $key
     * @param  int $cfop
     * @return Pedido|false
     */
    private function importOrder($key, $cfop)
    {
        $order         = null;
        $idMarketplace = null;

        $marketplace = 'Venda direta';
        if (strstr(strtoupper($this->nfe->infAdic->infCpl), 'B2W') !== false) {
            $marketplace = 'B2W';
        } elseif (strstr(strtoupper($this->nfe->infAdic->infCpl), 'CNOVA') !== false) {
            $marketplace = 'CNOVA';
        } elseif (strstr(strtoupper($this->nfe->infAdic->infCpl), 'MERCADO LIVRE') !== false) {
            $marketplace = 'MERCADOLIVRE';
        } elseif (strstr(strtoupper($this->nfe->infAdic->infCpl), 'WALMART') !== false) {
            $marketplace = 'WALMART';
        } elseif (strstr(strtoupper($this->nfe->infAdic->infCpl), 'GROUPON') !== false) {
            $marketplace = 'GROUPON';
        } elseif (strstr(strtoupper($this->nfe->infAdic->infCpl), 'SITE') !== false) {
            $marketplace = 'Site';
        }

        preg_match('/PEDIDO [0-9]{2,}\-?([0-9]{6,})?\w+/', $this->nfe->infAdic->infCpl, $codPedido);
        if ($codPedido) {
            $idMarketplace = parseMarketplaceId($marketplace, substr($codPedido[0], strpos($codPedido[0], ' ') + 1));
            $order         = Pedido::withTrashed()->where('codigo_marketplace', '=', $idMarketplace)->first();
        }

        if (!$order) {
            $order = Pedido::withTrashed()->find((int)substr($key, 25, 10));
        }

        if (!$order) {
            $order = Pedido::find($idMarketplace);
        }

        if (!$order) {
            if ($this->isMarketplace) {
                $order = new Pedido;
                $order->status = 1;
            } else {
                throw new \Exception('O pedido não existe no tucano!', 7);
            }
        }

        // Cliente
        $client = $this->importCliente($order);

        // Endereço
        $clientAddress = $this->importClienteEndereco($client);

        if ($idMarketplace) {
            $order->codigo_marketplace = $idMarketplace;
        }

        $order->cliente_id          = $client->id;
        $order->cliente_endereco_id = $clientAddress->id;
        $order->marketplace         = $marketplace;
        $order->operacao            = $cfop;
        // total + frete
        $order->total               = $this->nfe->total->ICMSTot->vNF + $order->frete_valor;
        $order->deleted_at          = null;

        if ($order->save()) {
            Log::info('Pedido importado ' . $order->id);
        } else {
            Log::warning('Não foi possível importar o pedido ' . $order->id);

            return false;
        }

        return $order;
    }

    /**
     * Import order customer
     *
     * @param  Pedido $order
     * @return Cliente|false
     */
    private function importCliente($order)
    {
        if ($this->nfe->dest->CNPJ) {
            $type   = 1;
            $taxvat = $this->nfe->dest->CNPJ;
            $ie     = $this->nfe->dest->IE;
        } else {
            $type   = 0;
            $taxvat = $this->nfe->dest->CPF;
            $ie     = null;
        }

        $taxvat = (string) $taxvat;

        if (!$this->isMarketplace && !strstr($taxvat, $order->cliente->taxvat)) {
            throw new \Exception('O documento do cliente na nota não bate com o cadastrado!', 7);
        }

        $client = Cliente::firstOrCreate(['taxvat' => $taxvat]);

        $client->taxvat    = $taxvat;
        $client->tipo      = $type;
        $client->nome      = $this->nfe->dest->xNome;
        $client->fone      = '(' . substr($this->nfe->dest->enderDest->fone, 0, 2) . ') ' . substr($this->nfe->dest->enderDest->fone, 2, 4) . '-' . substr($this->nfe->dest->enderDest->fone, 6, 4);
        $client->inscricao = $ie;

        // Só cadastraremail se  o cliente não existia
        if ($client->wasRecentlyCreated && $this->nfe->dest->email) {
            $client->email = $this->nfe->dest->email;
        }

        if ($client->save()) {
            Log::info('Cliente importado ' . $client->id);
        } else {
            Log::warning('Não foi possível importar o cliente ' . $taxvat);
        }

        return $client;
    }

    /**
     * Import client address
     *
     * @param  Cliente $client
     * @return Endereco|false
     */
    private function importClienteEndereco($client)
    {
        $address = Endereco::firstOrCreate([
            'cliente_id' => $client->id,
            'cep'        => $this->nfe->dest->enderDest->CEP
        ]);

        if ($address->wasRecentlyCreated) {
            $address->cliente_id  = $client->id;
            $address->cep         = $this->nfe->dest->enderDest->CEP;
            $address->rua         = $this->nfe->dest->enderDest->xLgr;
            $address->numero      = $this->nfe->dest->enderDest->nro;
            $address->complemento = removeAcentos($this->nfe->dest->enderDest->xCpl);
            $address->bairro      = $this->nfe->dest->enderDest->xBairro;
            $address->cidade      = $this->nfe->dest->enderDest->xMun;
            $address->uf          = $this->nfe->dest->enderDest->UF;

            if ($address->save()) {
                Log::info('Endereço do cliente importado ' . $address->id);
            } else {
                Log::warning('Não foi possível importar o endereço do cliente ' . $client->id);
            }
        }

        return $address;
    }
}
