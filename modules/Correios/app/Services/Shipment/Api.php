<?php namespace Correios\Services\Shipment;

use PhpSigep\Bootstrap;
use PhpSigep\Model\Dimensao;
use PhpSigep\Model\Etiqueta;
use PhpSigep\Model\Remetente;
use PhpSigep\Model\AccessData;
use PhpSigep\Model\Destinatario;
use PhpSigep\Model\ObjetoPostal;
use PhpSigep\Pdf\CartaoDePostagem;
use PhpSigep\Model\DestinoNacional;
use PhpSigep\Model\ServicoAdicional;
use PhpSigep\Model\ServicoDePostagem;
use PhpSigep\Model\PreListaDePostagem;
use App\Interfaces\ShipmentApiInterface;
use Core\Models\OrderShipment;

class Api implements ShipmentApiInterface
{
    /**
     * @var AccessData
     */
    private $accessData;

    /**
     * @var OrderShipment
     */
    private $shipment;

    public function __construct(OrderShipment $shipment)
    {
        $this->accessData = new AccessData(config('correios.api.accessData'));
        $this->shipment   = $shipment;
    }

    /**
     * Boot API starting bootstrap
     *
     * @return void
     */
    private function bootApi()
    {
        $config = new \PhpSigep\Config();
        $config->setAccessData($this->accessData);
        $config->setEnv(\PhpSigep\Config::ENV_PRODUCTION);
        $config->setCacheOptions([
            'storageOptions' => [
                'enabled'  => false
            ],
        ]);

        Bootstrap::start($config);
    }

    /**
     * Refresh shipment status
     *
     * @return int
     */
    public function refreshStatus()
    {
        $ultimoEvento = $this->lastStatus($rastreio->rastreio);

        $prazoEntrega = date('d/m/Y', strtotime($rastreio->data_envio));
        $prazoEntrega = \SomaDiasUteis($prazoEntrega, $rastreio->prazo);
        $prazoEntrega = date('Ymd', \dataToTimestamp($prazoEntrega));

        $dateDiff = 0;
        if ($rastreio->data_envio) {
            $dateDiff = (Carbon::createFromFormat('Y-m-d', date('Y-m-d')))
                ->diffInDays(Carbon::createFromFormat('Y-m-d', $rastreio->data_envio));
        }

        $status = 1;
        if ($ultimoEvento === false) {
                    return $rastreio;
        } else if (!$ultimoEvento['acao']) {
            $status = $rastreio->status;
        } elseif (in_array($ultimoEvento['status'], [9, 28, 37, 43, 50, 51, 52, 80])) {
            $status = 3;
        } elseif (in_array($ultimoEvento['status'], [4, 5, 6, 8, 10, 21, 26, 33, 36, 40, 42, 48, 49, 56])) {
            $status = 5;
        } elseif (strpos($ultimoEvento['acao'], 'entregue') !== false) {
            $rastreio->order->status = 3;
            $rastreio->order->save();

            $status = 4;
        } elseif (in_array($ultimoEvento['status'], [2])) {
            $status = 6;
        } elseif ($prazoEntrega < date('Ymd')) {
            $status = 2;
        } else if ($dateDiff > 15) {
            $status = 9;
        }

        if ($rastreio->status == 0 && ($rastreio->status != $status)) {
            if ($firstStatusDate = $this->firstStatus($rastreio->rastreio)['data']) {
                $rastreio->data_envio = Carbon::createFromFormat('Y-m-d H:i', $firstStatusDate)->format('Y-m-d');
            }
        }
    }

    /**
     * Set shipment deadline
     *
     * @return int
     */
    public function calculateDeadline()
    {
        $this->bootApi();

        $dimention = new \PhpSigep\Model\Dimensao();
        $dimention->setTipo(\PhpSigep\Model\Dimensao::TIPO_PACOTE_CAIXA);

        $params = new \PhpSigep\Model\CalcPrecoPrazo();
        $params->setAccessData($this->accessData);
        $params->setCepOrigem(config('correios.api.remetente.cep'));
        $params->setCepDestino($this->shipment->order->customerAddress->zipcode);
        $params->setServicosPostagem([new \PhpSigep\Model\ServicoDePostagem($this->shipment->shipmentMethod->api_code)]);
        $params->setAjustarDimensaoMinima(true);
        $params->setDimensao($dimention);
        $params->setPeso(0.5);// 150 gramas

        $phpSigep = new \PhpSigep\Services\SoapClient\Real();
        $result = $phpSigep->calcPrecoPrazo($params);

        if (!$result->getResult())
          throw new \Exception("Can't fetch result from API");

        return $result->getResult()[0]->getPrazoEntrega();
    }

    /**
     * Return the history from the shipment
     *
     * @return array
     */
    public function history()
    {
        $this->bootApi();

        $label = new \PhpSigep\Model\Etiqueta();
        $label->setEtiquetaComDv($this->shipment->tracking_code);
        $label->setEtiquetaSemDv($label->getEtiquetaSemDv());

        $labels[] = $label;

        $params = new \PhpSigep\Model\RastrearObjeto();
        $params->setAccessData($this->accessData);
        $params->setEtiquetas($labels);

        $phpSigep = new \PhpSigep\Services\SoapClient\Real();
        $result = $phpSigep->rastrearObjeto($params);

        $history = [];

        if (!$result->getResult())
          return false;

        foreach ($result->getResult()[0]->getEventos() as $index => $evento) {
            $history[$index]['status']   = (int) $evento->getStatus();
            $history[$index]['date']     = $evento->getDataHora();
            $history[$index]['location'] = "{$evento->getCidade()} / {$evento->getUf()} - {$evento->getLocal()}";
            $history[$index]['zipcode']  = $evento->getCodigo();
            $history[$index]['action']   = $evento->getDescricao();
            $history[$index]['detail']   = $evento->getDetalhe();
        }

        return $history;
    }

    /**
     * Return the printable label from shipment
     *
     * @return void
     */
    public function printLabel()
    {
        $this->bootApi();

        /**
         * Remetente
         */
        $remetente = new Remetente();
        $remetente->setNome(config('correios.api.remetente.nome'));
        $remetente->setTelefone(config('correios.api.remetente.telefone'));
        $remetente->setLogradouro(config('correios.api.remetente.rua'));
        $remetente->setNumero(config('correios.api.remetente.numero'));
        $remetente->setComplemento(config('correios.api.remetente.complemento'));
        $remetente->setBairro(config('correios.api.remetente.bairro'));
        $remetente->setCep(config('correios.api.remetente.cep'));
        $remetente->setUf(config('correios.api.remetente.uf'));
        $remetente->setCidade(config('correios.api.remetente.cidade'));

        /**
         * Dimensões do produto
         */
        $dimensao = new Dimensao();
        $dimensao->setAltura(7);
        $dimensao->setLargura(14);
        $dimensao->setComprimento(23);
        $dimensao->setTipo(Dimensao::TIPO_PACOTE_CAIXA);

        /**
         * Destinatário
         */
        $destinatario = new Destinatario();
        $destinatario->setNome($this->shipment->order->customer->name);
        $destinatario->setLogradouro($this->shipment->order->customerAddress->street);
        $destinatario->setNumero($this->shipment->order->customerAddress->number);
        $destinatario->setComplemento($this->shipment->order->customerAddress->complement);

        $destino = new DestinoNacional();
        $destino->setBairro($this->shipment->order->customerAddress->district);
        $destino->setCep($this->shipment->order->customerAddress->zipcode);
        $destino->setCidade($this->shipment->order->customerAddress->city);
        $destino->setUf($this->shipment->order->customerAddress->state);
        $destino->setNumeroNotaFiscal($this->shipment->order->invoices()->orderBy('created_at', 'DESC')->first()->invoice->number);

        /**
         * Rastreio
         */
        $etiqueta = new Etiqueta();
        $etiqueta->setEtiquetaComDv($this->shipment->tracking_code);
        $etiqueta->setEtiquetaSemDv($etiqueta->getEtiquetaSemDv());

        /**
         * Registro
         */
        $servicoAdicional = new ServicoAdicional();
        $servicoAdicional->setCodigoServicoAdicional(ServicoAdicional::SERVICE_REGISTRO);

        /**
         * Encomenda
         */
        $encomenda = new ObjetoPostal();
        $encomenda->setServicosAdicionais(array($servicoAdicional));
        $encomenda->setDestinatario($destinatario);
        $encomenda->setDestino($destino);
        $encomenda->setDimensao($dimensao);
        $encomenda->setEtiqueta($etiqueta);
        $encomenda->setPeso(0.500 * (int) $this->shipment->order->orderProducts->count());
        $encomenda->setLote(round($this->shipment->order->total - $this->shipment->order->shipping_cost));
        $encomenda->setServicoDePostagem(new ServicoDePostagem($this->shipment->shipmentMethod->api_code));

        $plp = new PreListaDePostagem();
        $plp->setAccessData($this->accessData);

        $plp->setEncomendas([$encomenda]);
        $plp->setRemetente($remetente);

        $pdf = new \PhpSigep\Pdf\CartaoDePostagem($plp, null, null);

        $pdf->render('I', 'etiquetas.pdf');
        die();
    }

    /**
     * Return new valid tracking code
     *
     * @return string
     */
    public function generateTrackingCode()
    {
        $trackingCode = $this->shipment->shipmentMethod->validTrackingCode();

        $trackingCode->current = $trackingCode->current + 1;
        $trackingCode->save();

        $etiqueta = new Etiqueta();
        $etiqueta->setEtiquetaSemDv($trackingCode->prefix . $trackingCode->current);

        return $etiqueta->getEtiquetaComDv() . 'BR';
    }

    /**
     * Return issue creating URL
     *
     * @param  int $id
     * @return void
     */
    public function pi()
    {
        $infoPi = http_build_query([
            'rastreio'    => $this->shipment->rastreio,
            'nome'        => $this->shipment->order->customer->nome,
            'cep'         => $this->shipment->order->customerAddress->cep,
            'customerAddress'    => $this->shipment->order->customerAddress->rua,
            'numero'      => $this->shipment->order->customerAddress->numero,
            'complemento' => $this->shipment->order->customerAddress->complemento,
            'bairro'      => $this->shipment->order->customerAddress->bairro,
            'data'        => $this->shipment->data_envio_readable,
            'tipo'        => $this->shipment->servico,
            'status'      => ($this->shipment->status == 3) ? 'e' : 'a'
        ]);

        return redirect()->away('http://www2.correios.com.br/sistemas/falecomoscorreios/?' . $infoPi);
    }
}
