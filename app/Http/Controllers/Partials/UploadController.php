<?php namespace App\Http\Controllers\Partials;

use App\Http\Controllers\Integracao\SkyhubController;
use App\Http\Controllers\Pedido\NotaController;
use App\Http\Controllers\Rastreio\RastreioController;
use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Imposto;
use App\Models\Pedido\Nota;
use App\Models\Pedido\Rastreio;
use App\Models\PedidoProduto;
use App\Models\Produto\Produto;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;

/**
 * Class UploadController
 * @package App\Http\Controllers\Partials
 */
class UploadController extends Controller
{
    use RestResponseTrait;

    /**
     * Upload
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function upload()
    {
        try {
            $arquivos = Input::file('arquivos');

            $uploadCount = 0;
            foreach ($arquivos as $nota) {

                /**
                 * Ambiente de testes
                 */
                $notaArquivo = $nota->getClientOriginalName();
                $tmp         = explode('.', $notaArquivo);
                $extensao    = strtolower(end($tmp));
                if ($extensao !== 'xml') { // Arquivos XML
                    throw new \Exception('Certifique-se de enviar apenas arquivos XML.');
                }

                $nota->move(storage_path('app/public/nota'), $notaArquivo);
                $xml = simplexml_load_file(storage_path('app/public/nota/' . $notaArquivo));

                if (!isset($xml->NFe))
                    continue;

                $this->uploadNota($notaArquivo, $xml);

                $uploadCount++;
            }

            $data = ['msg' => sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $uploadCount, count($arquivos))];
            return $this->createdResponse($data);
        } catch (\Exception $e) {
            \Log::alert(logMessage($e, 'Não foi possível fazer upload do arquivo'));

            $data = ['exception' => $e->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    private function uploadNota($notaArquivo, $xml, $usuario = false) {
        try {
            $nfe = $xml->NFe->infNFe;

            if (!$nfe)
                return true;

            /**
             * Cliente
             */
            if ($nfe->dest->CNPJ) {
                $tipo   = 1;
                $taxvat = $nfe->dest->CNPJ;
                $ie     = $nfe->dest->IE;
            } else {
                $tipo   = 0;
                $taxvat = $nfe->dest->CPF;
                $ie     = null;
            }

            $cliente = Cliente::firstOrNew(['taxvat' => $taxvat]);

            $cliente->taxvat      = $taxvat;
            $cliente->tipo        = $tipo;
            $cliente->nome        = $nfe->dest->xNome;
            $cliente->fone        = '(' . substr($nfe->dest->enderDest->fone, 0, 2) . ') ' . substr($nfe->dest->enderDest->fone, 2, 4) . '-' . substr($nfe->dest->enderDest->fone, 6, 4);
            $cliente->email       = ($nfe->dest->email) ?: null;
            $cliente->inscricao   = $ie;

            $cliente->save();

            /**
             * Endereço
             */
            $clienteEndereco = Endereco::firstOrNew(['cliente_id' => $cliente->id, 'cep' => $nfe->dest->enderDest->CEP]);

            $clienteEndereco->cliente_id  = $cliente->id;
            $clienteEndereco->cep         = $nfe->dest->enderDest->CEP;
            $clienteEndereco->rua         = $nfe->dest->enderDest->xLgr;
            $clienteEndereco->numero      = $nfe->dest->enderDest->nro;
            $clienteEndereco->complemento = $nfe->dest->enderDest->xCpl;
            $clienteEndereco->bairro      = $nfe->dest->enderDest->xBairro;
            $clienteEndereco->cidade      = $nfe->dest->enderDest->xMun;
            $clienteEndereco->uf          = $nfe->dest->enderDest->UF;

            $clienteEndereco->save();

            /**
             * Chave
             */
            $chave = $xml->protNFe->infProt->chNFe;

            /**
             * Marketplace
             */
            $marketplace = 'Site';
            if (strpos(strtoupper($nfe->infAdic->infCpl), 'B2W') !== false) {
                $marketplace = 'B2W';
            } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'CNOVA') !== false) {
                $marketplace = 'CNOVA';
            } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'MERCADO LIVRE') !== false) {
                $marketplace = 'MERCADOLIVRE';
            } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'WALMART') !== false) {
                $marketplace = 'WALMART';
            } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'GROUPON') !== false) {
                $marketplace = 'GROUPON';
            }

            /**
             * Pedido
             */
            $pedido = null;
            $idMarketplace = null;
            preg_match('/PEDIDO [0-9]{2,}\-?([0-9]{6,})?\w+/', $nfe->infAdic->infCpl, $codPedido);
            if ($codPedido) {
                $codigoMarketplace = substr($codPedido[0], strpos($codPedido[0], ' ') + 1);
                $idMarketplace     = with(new SkyhubController())->parseMarketplaceId($marketplace, $codigoMarketplace);

                $pedido = Pedido::withTrashed()->where('codigo_marketplace', '=', $idMarketplace)->first();
            }

            if ($pedido == null) {
                $idPedido = substr($chave, 25, 10);
                $pedido = Pedido::withTrashed()->findOrNew($idPedido);
                $pedido->status = 2;

                if ($idMarketplace) {
                    $pedido->codigo_marketplace = $idMarketplace;
                }
            } else {
                $idPedido = $pedido->id;
            }

            $pedido->deleted_at = null;

            /**
             * Produtos
             */
            $produtos = null;
            if (sizeof($nfe->det) > 1) {
                $produtos = $nfe->det;
            } else {
                $produtos[] = $nfe->det;
            }

            /**
             * Operação
             */
            $operacao = $produtos[0]->prod->CFOP;

            if (!in_array((int) $operacao, array_merge(Config::get('tucano.operacoes'), Config::get('tucano.devolucao'))))
                return true;

            /**
             * Total
             */
            $notaTotal = $nfe->total->ICMSTot->vNF;

            /**
             * Devolução
             */
            if (in_array((int) $operacao, Config::get('tucano.devolucao')))
                $notaTotal = ((float) $notaTotal) * -1;

            /**
             * Salva o pedido
             */
            $pedido->id                    = $idPedido;
            $pedido->cliente_id            = $cliente->id;
            $pedido->cliente_endereco_id   = $clienteEndereco->id;
            $pedido->marketplace           = $marketplace;
            $pedido->operacao              = $operacao;
            $pedido->total                 = $notaTotal;

            $pedido->save();

            /**
             * Data da nota
             */
            $datetimeNota = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $nfe->ide->dhEmi);
            $dataNota = $datetimeNota->format('Y-m-d');

            /**
             * Salva a nota
             */
            $nota = Nota::withTrashed()->findOrNew($idPedido);
            $nota->pedido_id  = $idPedido;
            $nota->usuario_id = ($usuario) ?: JWTAuth::parseToken()->authenticate()->id;
            $nota->data       = $dataNota;
            $nota->chave      = $chave;
            $nota->arquivo    = $notaArquivo;
            $nota->deleted_at = null;

            $nota->save();

            /**
             * Rastreio
             */
            $rastreio = null;
            preg_match('/([A-Za-z]{2}[0-9]{9})\w+/', $nfe->infAdic->infCpl, $codPost);
            if ($codPost) {
                $rastreio = strtoupper(substr($codPost[0], 0, 13));
            }

            if ($rastreio && !in_array($operacao, Config::get('tucano.devolucao'))) {
                /**
                 * Serviço de envio
                 */
                $tipoRastreio    = substr($rastreio, 0, 1);
                $metodoEnvio     = null;
                if ($tipoRastreio == 'P') {
                    $metodoEnvio = 'PAC';
                } elseif ($tipoRastreio == 'D') {
                    $metodoEnvio = 'SEDEX';
                }

                /**
                 * Valor de frete
                 */
                $freteTotal = null;
                if ($posInicial = strpos(strtoupper($nfe->infAdic->infCpl), 'FRETE')) {
                    preg_match('/[0-9]{2,3}\.[0-9]{2}/', substr($nfe->infAdic->infCpl, $posInicial, 40), $frete);
                    if ($frete)
                        $freteTotal = $frete[0];
                }

                /**
                 * Data de envio
                 */
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
                $prazoEntrega = RastreioController::deadline($rastreio, $nfe->dest->enderDest->CEP);

                /**
                 * Salva o rastreio
                 */
                $pedidoRastreio = Rastreio::firstOrNew(['pedido_id' => $idPedido, 'rastreio' => $rastreio]);
                $pedidoRastreio->pedido_id  = $idPedido;
                $pedidoRastreio->rastreio   = $rastreio;
                $pedidoRastreio->data_envio = $dataEnvio;
                $pedidoRastreio->servico    = $metodoEnvio;
                $pedidoRastreio->valor      = $freteTotal;
                $pedidoRastreio->prazo      = $prazoEntrega;

                $pedidoRastreio->save();
            }

            /**
             * Impostos
             */
            $imposto = Imposto::findOrNew($idPedido);
            $imposto->pedido_id         = $idPedido;
            $imposto->icms              = $nfe->total->ICMSTot->vICMS;
            $imposto->pis               = $nfe->total->ICMSTot->vPIS;
            $imposto->cofins            = $nfe->total->ICMSTot->vCOFINS;
            $imposto->icms_destinatario = $nfe->total->ICMSTot->vICMSUFDest;
            $imposto->icms_remetente    = $nfe->total->ICMSTot->vICMSUFRemet;

            $imposto->save();

            /**
             * IMEI's
             */
            $lastPos = 0;
            $positions = [];
            while (($lastPos = stripos($nfe->infAdic->infCpl, 'PROD.:', $lastPos)) !== false) {
                $positions[] = $lastPos;
                $lastPos = $lastPos + strlen('PROD.:');
            }

            $produtoImei = [];
            foreach ($positions as $key => $pos) {
              $posFind = ' | ';
              if ((sizeof($positions) - 1) == $key)
                $posFind = '-';

              $lineProduto = substr($nfe->infAdic->infCpl, $pos, (stripos($nfe->infAdic->infCpl, $posFind, $pos) - $pos));

              $skuProduto = (int) substr($lineProduto, stripos($lineProduto, '.: ') + 3, 5);
              $imeis = trim(substr($lineProduto, stripos($lineProduto, 'S/N') + 5));

              $produtoImei[$skuProduto] = $imeis;
            }

            /**
             * Produtos
             */
            foreach ($produtos as $item) {
                $produto = Produto::findOrNew((int) $item->prod->cProd);

                // Cria as informações do produto se ele nao existir
                if ($produto->wasRecentlyCreated) {
                    $produto->sku    = (int) $item->prod->cProd;
                    $produto->titulo = $item->prod->xProd;
                    $produto->ncm    = $item->prod->NCM;
                    $produto->ean    = $item->prod->cEAN;
                    $produto->save();
                }

                $pedidoProduto = PedidoProduto::firstOrNew(['pedido_id' => $idPedido, 'produto_sku' => $produto->sku]);

                $pedidoProduto->pedido_id   = $idPedido;
                $pedidoProduto->produto_sku = (int) $item->prod->cProd;
                $pedidoProduto->valor       = $item->prod->vUnCom;
                $pedidoProduto->quantidade  = $item->prod->qCom;
                $pedidoProduto->imei        = array_key_exists((int) $item->prod->cProd, $produtoImei) ? $produtoImei[(int) $item->prod->cProd] : '';

                $pedidoProduto->save();
            }

            /**
             * Envia e-mail de compra
             */
            if ($nfe->dest->email) {
                $nome  = (string) $nfe->dest->xNome;
                $email = (string) $nfe->dest->email;
                $dataHora = date('His');

                Mail::send('emails.compra', [
                    'nome' => $nfe->dest->xNome,
                    'produtos' => $produtos,
                    'rastreio' => $rastreio
                ], function($message) use ($idPedido, $dataHora, $email, $nome) {
                    with(new NotaController())->danfe($idPedido, 'F', storage_path('app/public/' . $dataHora . '.pdf'));

                    $message
                        ->attach(storage_path('app/public/' . $dataHora . '.pdf'), ['as' => 'nota.pdf', 'mime' => 'application/pdf'])
                        ->to($email)
                        ->subject('Obrigado por comprar na Carioca Celulares On-line');
                });

                unlink(storage_path('app/public/' . $dataHora . '.pdf'));
            }
        } catch (\Exception $e) {
            \Log::alert(logMessage($e, 'Não foi possível fazer upload do arquivo'));

            return false;
        }

        return true;
    }
}
