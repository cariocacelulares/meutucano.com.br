<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoImposto;
use App\Models\PedidoNota;
use App\Models\PedidoProduto;
use App\Models\PedidoRastreio;
use App\Models\Produto;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;

/**
 * Class UploadController
 * @package App\Http\Controllers
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
            $usuario  = Input::get('usuario');
            $arquivos = Input::file('arquivos');

            $uploadCount = 0;

            foreach ($arquivos as $nota) {
                $notaArquivo = $nota->getClientOriginalName();
                $tmp         = explode('.', $notaArquivo);
                $extensao    = strtolower(end($tmp));
                if ($extensao == 'xml') {
                    if ($nota->move(storage_path('app/public/nota'), $notaArquivo)) {

                        $xml = simplexml_load_file(storage_path('app/public/nota/' . $notaArquivo));
                        if (!isset($xml->NFe))
                            continue;

                        $nfe = $xml->NFe->infNFe;

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
                        $clienteEndereco = ClienteEndereco::firstOrNew(['cliente_id' => $cliente->id, 'cep' => $nfe->dest->enderDest->CEP]);

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
                        $idPedido = substr($chave, 25, 10);

                        $pedido = Pedido::findOrNew($idPedido);

                        /**
                         * Marketplace
                         */
                        $marketplace = 'Site';
                        $marketplace_adicional = '';
                        if (strpos(strtoupper($nfe->infAdic->infCpl), 'B2W') !== false) {
                            $marketplace = 'B2W';
                        } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'CNOVA') !== false) {
                            $marketplace = 'CNOVA';
                        } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'MERCADO LIVRE DIAMANTE') !== false) {
                            $marketplace = 'MERCADOLIVRE';
                            $marketplace_adicional = 'DIAMANTE';
                        } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'MERCADO LIVRE OURO') !== false) {
                            $marketplace = 'MERCADOLIVRE';
                            $marketplace_adicional = 'OURO';
                        } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'WALMART') !== false) {
                            $marketplace = 'WALMART';
                        } elseif (strpos(strtoupper($nfe->infAdic->infCpl), 'GROUPON') !== false) {
                            $marketplace = 'GROUPON';
                        }

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
                            continue;

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
                        $pedido->marketplace_adicional = $marketplace_adicional;
                        $pedido->operacao              = $operacao;
                        $pedido->total                 = $notaTotal;

                        $pedido->save();

                        /**
                         * Data da nota
                         */
                        $datetimeNota = \DateTime::createFromFormat('Y-m-d', substr($nfe->ide->dhEmi, 0, 10));
                        $dataNota = $datetimeNota->format('Y-m-d');

                        /**
                         * Salva a nota
                         */
                        $nota = PedidoNota::findOrNew($idPedido);
                        $nota->pedido_id  = $idPedido;
                        $nota->usuario_id = $usuario;
                        $nota->data       = $dataNota;
                        $nota->chave      = $chave;
                        $nota->arquivo    = $notaArquivo;

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
                            $tipoRastreio    = substr($rastreio, 0, 2);
                            $metodoEnvio     = null;
                            if (in_array($tipoRastreio, Config::get('tucano.pac'))) {
                                $metodoEnvio = 'PAC';
                            } elseif (in_array($tipoRastreio, Config::get('tucano.sedex'))) {
                                $metodoEnvio = 'SEDEX';
                            }

                            /**
                             * Valor de frete
                             */
                            $freteTotal = null;
                            if ($posInicial = strpos(strtoupper($nfe->infAdic->infCpl), 'FRETE')) {
                                preg_match('/[0-9]{2,3}\.[0-9]{2}/', substr($nfe->infAdic->infCpl, $posInicial, 25), $frete);
                                $freteTotal = $frete[0];
                            }

                            /**
                             * Data de envio
                             */
                            $dataEnvio = $datetimeNota->add(date_interval_create_from_date_string('+1 day'));
                            if ($dataEnvio->format('w') == '6') {
                                $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+2 day'));
                            } else if ($dataEnvio->format('w') == '0') {
                                $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+1 day'));
                            }

                            $dataEnvio = $dataEnvio->format('Y-m-d');

                            /**
                             * Calcula prazo
                             */
                            $prazoEntrega = PedidoRastreioController::deadline($rastreio, $nfe->dest->enderDest->CEP);

                            /**
                             * Salva o rastreio
                             */
                            $pedidoRastreio = PedidoRastreio::firstOrNew(['pedido_id' => $idPedido, 'tipo' => 0]);
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
                        $imposto = PedidoImposto::findOrNew($idPedido);
                        $imposto->pedido_id         = $idPedido;
                        $imposto->icms              = $nfe->total->ICMSTot->vICMS;
                        $imposto->pis               = $nfe->total->ICMSTot->vPIS;
                        $imposto->cofins            = $nfe->total->ICMSTot->vCOFINS;
                        $imposto->icms_destinatario = $nfe->total->ICMSTot->vICMSUFDest;
                        $imposto->icms_remetente    = $nfe->total->ICMSTot->vICMSUFRemet;

                        $imposto->save();

                        /**
                         * Produtos
                         */
                        foreach ($produtos as $item) {
                            $produto = Produto::findOrNew((int) $item->prod->cProd);
                            $produto->sku    = (int) $item->prod->cProd;
                            $produto->titulo = $item->prod->xProd;
                            $produto->ncm    = $item->prod->NCM;
                            $produto->ean    = $item->prod->cEAN;

                            $produto->save();

                            $pedidoProduto = PedidoProduto::firstOrNew(['pedido_id' => $idPedido, 'produto_sku' => $produto->sku]);

                            $pedidoProduto->pedido_id   = $idPedido;
                            $pedidoProduto->produto_sku = (int) $item->prod->cProd;
                            $pedidoProduto->valor       = $item->prod->vUnCom;
                            $pedidoProduto->quantidade  = $item->prod->qCom;

                            $pedidoProduto->save();
                        }

                        $uploadCount++;
                    }
                }
            }

            $data = ['msg' => sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $uploadCount, count($arquivos))];
            return $this->createdResponse($data);
        } catch (\Exception $e) {
            $data = ['exception' => $e->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}