<?php namespace App\Http\Controllers\Partials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Integracao\SkyhubController;
use App\Http\Controllers\Pedido\NotaController;
use App\Http\Controllers\Pedido\RastreioController;
use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Imposto;
use App\Models\Pedido\Nota;
use App\Models\Pedido\Nota\Devolucao;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\PedidoProduto;
use App\Models\Produto\Produto;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Class UploadController
 * @package App\Http\Controllers\Partials
 */
class UploadController extends Controller
{
    use RestResponseTrait;

    protected $nfe = null;
    protected $protNfe = null;

    /**
     * Upload
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function upload()
    {
        try {
            $arquivos = Input::file('arquivos');
            $usuario_id = JWTAuth::parseToken()->authenticate()->id;

            $uploadCount = 0;
            foreach ($arquivos as $nota) {
                /**
                 * Ambiente de testes
                 */
                $notaArquivo = $nota->getClientOriginalName();
                $partsNota = explode('.', $notaArquivo);
                $extensao = strtolower(end($partsNota));

                // Arquivos XML
                if ($extensao !== 'xml') {
                    throw new \Exception('Certifique-se de enviar apenas arquivos XML.');
                }

                $nota->move(storage_path('app/public/nota'), $notaArquivo);
                $xml = simplexml_load_file(storage_path('app/public/nota/' . $notaArquivo));

                if (!isset($xml->NFe->infNFe)) {
                    continue;
                } else {
                    $this->nfe = $xml->NFe->infNFe;

                    if (isset($xml->protNFe)) {
                        $this->protNfe = $xml->protNFe;
                    }
                }

                if ($this->uploadNota($notaArquivo, $usuario_id)) {
                    $uploadCount++;
                }
            }

            $data = ['msg' => sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $uploadCount, count($arquivos))];
            Log::info(sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $uploadCount, count($arquivos)));
            return $this->createdResponse($data);
        } catch (\Exception $e) {
            Log::alert(logMessage($e, 'Não foi possível fazer upload do arquivo'));

            $data = ['exception' => $e->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Faz o upload da nota e importa informações de cliente, endereço, pedido e rastreio
     *
     * @param  string  $notaArquivo  arquivo da nota
     * @param  boolean|int $usuario  usuário que importou a nota
     * @return boolean
     */
    private function uploadNota($notaArquivo, $usuario_id = false) {
        try {
            if (!$usuario_id) {
                $usuario_id = JWTAuth::parseToken()->authenticate()->id;

                if (!$usuario_id) {
                    $usuario_id = null;
                }
            }

            // Cliente
            $cliente = $this->importCliente();

            // Endereço
            $clienteEndereco = $this->importClienteEndereco($cliente);

            /**
             * Produtos
             */
            $produtos = null;
            if (sizeof($this->nfe->det) > 1) {
                $produtos = $this->nfe->det;
            } else {
                $produtos[] = $this->nfe->det;
            }

            // Operação, CFOP
            $operacao = (int)$produtos[0]->prod->CFOP;

            // Tipo da operação
            $tipoOperacao = null;
            if (in_array($operacao, Config::get('tucano.notas.operacoes'))) {
                $tipoOperacao = 'venda';
            } else if (!in_array($operacao, Config::get('tucano.notas.devolucao'))) {
                $tipoOperacao = 'devolucao';
            } else if (!in_array($operacao, Config::get('tucano.notas.estorno'))) {
                $tipoOperacao = 'estorno';
            } else {
                return false;
            }

            // Chave
            $chave = $this->protNfe->infProt->chNFe;

            // Pedido
            $pedido = $this->importPedido($chave, $cliente, $clienteEndereco, $operacao, $tipoOperacao);

            // Data
            $datetimeNota = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $this->nfe->ide->dhEmi);
            $dataNota = $datetimeNota->format('Y-m-d');

            if (in_array($tipoOperacao, ['devolucao', 'estorno'])) {
                return $this->importDevolucao($chave, $usuario_id, $notaArquivo, $tipoOperacao, $dataNota);
            } else {
                return $this->importVenda($chave, $pedido, $usuario_id, $dataNota, $notaArquivo, $produtos, $datetimeNota);
            }
        } catch (\Exception $e) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::alert(logMessage($e, 'Não foi possível fazer upload do arquivo'));
            return false;
        }
    }

    /**
     * Importa os dados do cliente
     *
     * @return Cliente
     */
    private function importCliente() {
        if ($this->nfe->dest->CNPJ) {
            $tipo = 1;
            $taxvat = $this->nfe->dest->CNPJ;
            $ie = $this->nfe->dest->IE;
        } else {
            $tipo = 0;
            $taxvat = $this->nfe->dest->CPF;
            $ie = null;
        }

        $cliente = Cliente::firstOrNew(['taxvat' => $taxvat]);

        $cliente->taxvat = $taxvat;
        $cliente->tipo = $tipo;
        $cliente->nome = $this->nfe->dest->xNome;
        $cliente->fone = '(' . substr($this->nfe->dest->enderDest->fone, 0, 2) . ') ' . substr($this->nfe->dest->enderDest->fone, 2, 4) . '-' . substr($this->nfe->dest->enderDest->fone, 6, 4);
        $cliente->inscricao = $ie;

        // Só cadastrar email se  o cliente não existia
        if ($cliente->wasRecentlyCreated && $this->nfe->dest->email) {
            $cliente->email = $this->nfe->dest->email;
        }

        if ($cliente->save()) {
            Log::info('Cliente importado ' . $cliente->id);
        } else {
            Log::warning('Não foi possível importar o cliente ' . $taxvat);
        }

        return $cliente;
    }

    /**
     * Importa os dados do endereço  do cliente
     *
     * @param  Cliente $cliente
     * @return Endereco
     */
    private function importClienteEndereco($cliente) {
        $clienteEndereco = Endereco::firstOrNew(['cliente_id' => $cliente->id, 'cep' => $this->nfe->dest->enderDest->CEP]);

        $clienteEndereco->cliente_id = $cliente->id;
        $clienteEndereco->cep = $this->nfe->dest->enderDest->CEP;
        $clienteEndereco->rua = $this->nfe->dest->enderDest->xLgr;
        $clienteEndereco->numero = $this->nfe->dest->enderDest->nro;
        $clienteEndereco->complemento = $this->nfe->dest->enderDest->xCpl;
        $clienteEndereco->bairro = $this->nfe->dest->enderDest->xBairro;
        $clienteEndereco->cidade = $this->nfe->dest->enderDest->xMun;
        $clienteEndereco->uf = $this->nfe->dest->enderDest->UF;

        if ($clienteEndereco->save()) {
            Log::info('Endereço do cliente importado ' . $clienteEndereco->id);
        } else {
            Log::warning('Não foi possível importar o endereço do cliente ' . $cliente->id);
        }

        return $clienteEndereco;
    }

    /**
     * Importa os dados do pedido
     *
     * @param  string $chave               chave da nota
     * @param  Cliente $cliente
     * @param  ClienteEndereco $clienteEndereco
     * @param  int $operacao               cfop da operação
     * @param  string $tipoOperacao    venda|devolucao|estorno
     * @return Pedido
     */
    private function importPedido($chave, $cliente, $clienteEndereco, $operacao, $tipoOperacao) {
        $pedido = null;
        $idMarketplace = null;
        $notaTotal = $this->nfe->total->ICMSTot->vNF;

        if ($tipoOperacao == 'devolucao') {
            $notaTotal = ((float) $notaTotal) * -1;
        }

        $marketplace = 'Site';
        if (strpos(strtoupper($this->nfe->infAdic->infCpl), 'B2W') !== false) {
            $marketplace = 'B2W';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'CNOVA') !== false) {
            $marketplace = 'CNOVA';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'MERCADO LIVRE') !== false) {
            $marketplace = 'MERCADOLIVRE';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'WALMART') !== false) {
            $marketplace = 'WALMART';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'GROUPON') !== false) {
            $marketplace = 'GROUPON';
        }

        preg_match('/PEDIDO [0-9]{2,}\-?([0-9]{6,})?\w+/', $this->nfe->infAdic->infCpl, $codPedido);
        if ($codPedido) {
            $idMarketplace = with(new SkyhubController())->parseMarketplaceId($marketplace, substr($codPedido[0], strpos($codPedido[0], ' ') + 1));
            $pedido = Pedido::withTrashed()->where('codigo_marketplace', '=', $idMarketplace)->first();
        }

        if ($pedido == null) {
            $pedido = Pedido::withTrashed()->findOrNew((int)substr($chave, 25, 10));
        }

        if (!in_array($tipoOperacao, ['devolucao', 'estorno'])) {
            if ($idMarketplace) {
                $pedido->codigo_marketplace = $idMarketplace;
            }

            $pedido->status = 2;
            $pedido->cliente_id = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->marketplace = $marketplace;
            $pedido->operacao = $operacao;
            $pedido->total = $notaTotal;
            $pedido->deleted_at = null;

            if ($pedido->save()) {
                Log::info('Pedido importado ' . $pedido->id);
            } else {
                Log::warning('Não foi possível importar o pedido ' . $pedido->id);
            }
        }

        return $pedido;
    }

    /**
     * Importa a devolucao / extorno
     *
     * @param  string $chave              chave da nota
     * @param  int $usuario_id            usuário que subiu a nota
     * @param  sitring $notaArquivo
     * @param  string $tipoOperacao   venda|devolucao|extorno
     * @param  string $dataNota         data que a nota foi emitida
     * @return Devolucao
     */
    private function importDevolucao($chave, $usuario_id, $notaArquivo, $tipoOperacao, $dataNota)
    {
        $notaRef = null;
        if ($ref = $this->nfe->ide->NFref->refNFe) {
            $notaRef = Nota::withTrashed()->where('chave', '=', $ref)->first();
        }

        if (!$notaRef) {
            throw new \Exception('Não foi possível encontrar a nota de referência para a devolução: ' . $chave);
        }

        if (!$notaRef) {
            $notaRef = null;
            $params = [
                'chave' => $chave,
            ];
        } else {
            $params = [
                'chave' => $chave,
                'nota_id' => $notaRef->id
            ];
        }

        $devolucao = Devolucao::firstOrNew($params);
        $devolucao->usuario_id = $usuario_id;
        $devolucao->nota_id = ($notaRef) ? $notaRef->id : null;
        $devolucao->chave = $chave;
        $devolucao->arquivo = $notaArquivo;
        $devolucao->tipo = ($tipoOperacao == 'estorno') ? 1 : 0;
        $devolucao->data = $dataNota;

        if ($devolucao->save()) {
            Log::info('Devolução de nota importada ' . $devolucao->id);
        } else {
            Log::warning('Não foi possível importar a devolução da nota de venda: ' . $notaRef->id);
        }

        return $devolucao;
    }

    /**
     * Importa os dados de uma nota de venda
     *
     * @param  string $chave            chave da nota
     * @param  Pedido $pedido
     * @param  int $usuario_id          usuário que subiu a nota
     * @param  string $dataNota       data que a nota foi emitida
     * @param  string $notaArquivo
     * @param array $produtos
     * @return boolean
     */
    private function importVenda($chave, $pedido, $usuario_id, $dataNota, $notaArquivo, $produtos, $datetimeNota)
    {
        // Abre um transaction no banco de dados
        DB::beginTransaction();
        Log::debug('Transaction - begin');

        /**
         * Salva a nota
         */
        $nota = Nota::withTrashed()->firstOrNew([
            'pedido_id' => $pedido->id,
            'chave' => $chave
        ]);
        $nota->pedido_id = $pedido->id;
        $nota->usuario_id = $usuario_id;
        $nota->data = $dataNota;
        $nota->chave = $chave;
        $nota->arquivo = $notaArquivo;
        $nota->deleted_at = null;

        if ($nota->save()) {
            Log::info('Nota importada ' . $nota->id);
        } else {
            Log::warning('Não foi possível importar a nota do pedido ' . $pedido->id);
        }

        /**
         * Rastreio
         */
        $rastreio = null;
        preg_match('/([A-Za-z]{2}[0-9]{9})\w+/', $this->nfe->infAdic->infCpl, $codPost);
        if ($codPost) {
            $rastreio = strtoupper(substr($codPost[0], 0, 13));
        }

        if ($rastreio) {
            // Serviço de envio
            $tipoRastreio = substr($rastreio, 0, 1);
            $metodoEnvio = null;
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
            if ($datetimeNota->format('w') == '5' && $datetimeNota->format('H') <= 14) {
                $dataEnvio = $datetimeNota;
            } else {
                $dataEnvio = $datetimeNota->add(date_interval_create_from_date_string('+1 day'));
                if ($dataEnvio->format('w') == '6') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+2 day'));
                } else if ($dataEnvio->format('w') == '0') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+1 day'));
                }
            }

            $dataEnvio = $dataEnvio->format('Y-m-d');

            /**
             * Calcula prazo
             */
            $prazoEntrega = RastreioController::deadline($rastreio, $this->nfe->dest->enderDest->CEP);

            /**
             * Salva o rastreio
             */
            $pedidoRastreio = Rastreio::firstOrNew(['pedido_id' => $pedido->id, 'rastreio' => $rastreio]);
            $pedidoRastreio->pedido_id = $pedido->id;
            $pedidoRastreio->rastreio = $rastreio;
            $pedidoRastreio->data_envio = $dataEnvio;
            $pedidoRastreio->servico = $metodoEnvio;
            $pedidoRastreio->valor = $freteTotal;
            $pedidoRastreio->prazo = $prazoEntrega;

            if ($pedidoRastreio->save()) {
                Log::info('Rastreio importado ' . $pedidoRastreio->id);
            } else {
                Log::warning('Não foi possível importar o rastreio do pedido ' . $pedido->id);
            }
        }

        /**
         * Impostos
         */
        $imposto = Imposto::findOrNew($pedido->id);
        $imposto->pedido_id = $pedido->id;
        $imposto->icms = $this->nfe->total->ICMSTot->vICMS;
        $imposto->pis = $this->nfe->total->ICMSTot->vPIS;
        $imposto->cofins = $this->nfe->total->ICMSTot->vCOFINS;
        $imposto->icms_destinatario = $this->nfe->total->ICMSTot->vICMSUFDest;
        $imposto->icms_remetente = $this->nfe->total->ICMSTot->vICMSUFRemet;

        if ($imposto->save()) {
            Log::info('Imposto importado ' . $imposto->id);
        } else {
            Log::warning('Não foi possível importar o imposto do pedido ' . $pedido->id);
        }

        // Fecha a transação e comita as alterações
        DB::commit();
        Log::debug('Transaction - commit');

        /**
         * IMEI's
         */
        $lastPos = 0;
        $positions = [];
        while (($lastPos = stripos($this->nfe->infAdic->infCpl, 'PROD.:', $lastPos)) !== false) {
            $positions[] = $lastPos;
            $lastPos = $lastPos + strlen('PROD.:');
        }

        $produtoImei = [];
        foreach ($positions as $key => $pos) {
            $posFind = ' | ';
            if ((sizeof($positions) - 1) == $key)
            $posFind = '-';

            $lineProduto = substr($this->nfe->infAdic->infCpl, $pos, (stripos($this->nfe->infAdic->infCpl, $posFind, $pos) - $pos));

            $skuProduto = (int)substr($lineProduto, stripos($lineProduto, '.: ') + 3, 5);
            $imeis = trim(substr($lineProduto, stripos($lineProduto, 'S/N') + 5));

            $produtoImei[$skuProduto] = $imeis;
        }

        foreach ($produtos as $item) {
            $produto = Produto::firstOrCreate([ 'sku' => (int)$item->prod->cProd ]);

            // Cria as informações do produto se ele nao existir
            if ($produto->wasRecentlyCreated) {
                $produto->sku = (int)$item->prod->cProd;
                $produto->titulo = $item->prod->xProd;
                $produto->ncm = $item->prod->NCM;
                $produto->ean = $item->prod->cEAN;

                if ($produto->save()) {
                    Log::info('Produto importado ' . $produto->id);
                } else {
                    Log::warning('Não foi possível importar o produto ' . $item->prod->cProd);
                }
            }

            $pedidoProduto = PedidoProduto::firstOrNew(['pedido_id' => $pedido->id, 'produto_sku' => $produto->sku]);

            $pedidoProduto->pedido_id = $pedido->id;
            $pedidoProduto->produto_sku = (int)$item->prod->cProd;
            $pedidoProduto->valor = $item->prod->vUnCom;
            $pedidoProduto->quantidade = $item->prod->qCom;
            $pedidoProduto->imei = array_key_exists((int)$item->prod->cProd, $produtoImei) ? $produtoImei[(int)$item->prod->cProd] : '';

            if ($pedidoProduto->save()) {
                Log::info('Pedido Produto importado ' . $item->prod->cProd . ' / ' . $pedido->id);
            } else {
                Log::warning('Não foi possível importar o Pedido Produto ' . $item->prod->cProd . ' / ' . $pedido->id);
            }
        }

        /**
         * Envia e-mail de compra
         */
        if ($this->nfe->dest->email) {
            $nome = (string) $this->nfe->dest->xNome;
            $email = (string) $this->nfe->dest->email;
            $dataHora = date('His');

            /*Mail::send('emails.compra', [
                'nome' => $this->nfe->dest->xNome,
                'produtos' => $produtos,
                'rastreio' => $rastreio
            ], function($message) use ($pedido->id, $dataHora, $email, $nome) {
                with(new NotaController())->danfe($pedido->id, 'F', storage_path('app/public/' . $dataHora . '.pdf'));

                $message
                    ->attach(storage_path('app/public/' . $dataHora . '.pdf'), ['as' => 'nota.pdf', 'mime' => 'application/pdf'])
                    ->to($email)
                    ->subject('Obrigado por comprar na Carioca Celulares On-line');
            });

            unlink(storage_path('app/public/' . $dataHora . '.pdf'));*/
        }

        return true;
    }
}