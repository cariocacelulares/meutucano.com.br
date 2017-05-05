<?php namespace Core\Http\Controllers;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use Core\Models\Cliente\Endereco;

class ZipcodeController extends Controller
{
    use RestResponseTrait;

    private function getByViacep($cep)
    {
        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "https://viacep.com.br/ws/{$cep}/json/");
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            $address = curl_exec($curl);
            curl_close($curl);

            $address = json_decode($address);

            return !$address ? null : [
                'cep'         => $address->cep         ?: null,
                'rua'         => $address->logradouro  ?: null,
                'numero'      => $address->unidade     ?: null,
                'complemento' => $address->complemento ?: null,
                'bairro'      => $address->bairro      ?: null,
                'cidade'      => $address->localidade  ?: null,
                'uf'          => $address->uf          ?: null,
            ];
        } catch (\Exception $exception) {
        }

        return null;
    }

    private function getByPostmon($cep)
    {
        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "http://api.postmon.com.br/v1/cep/{$cep}");
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            $address = curl_exec($curl);
            curl_close($curl);

            $address = json_decode($address);

            return !$address ? null : [
                'cep'         => $address->cep        ?: null,
                'rua'         => $address->logradouro ?: null,
                'bairro'      => $address->bairro     ?: null,
                'cidade'      => $address->cidade     ?: null,
                'uf'          => $address->estado     ?: null,
                'numero'      => null,
                'complemento' => null,
            ];
        } catch (\Exception $exception) {
        }

        return null;
    }

    private function getByTucano($cep)
    {
        try {
            $address = Endereco::where('cep', '=', $cep)
                ->orderBy('created_at', 'DESC')
                ->first();

            return !$address ? null : [
                'cep'         => $address->cep    ?: null,
                'rua'         => $address->rua    ?: null,
                'bairro'      => $address->bairro ?: null,
                'cidade'      => $address->cidade ?: null,
                'uf'          => $address->uf     ?: null,
                'numero'      => null,
                'complemento' => null,
            ];
        } catch (Exception $exception) {
        }

        return null;
    }

    public function getAddress($cep)
    {
        try {
            $cep = numbers($cep);

            $address = $this->getByTucano($cep);

            if (!$address) {
                $address = $this->getByViacep($cep);
            }

            if (!$address) {
                $address = $this->getByPostmon($cep);
            }

            if ($address) {
                return $this->showResponse($address);
            }
        } catch (Exception $exception) {
            \Log::error(logMessage($exception, 'Erro a tentar obter um endereço via CEP.'));
        }

        return $this->showResponse([
            'cep'         => null,
            'rua'         => null,
            'bairro'      => null,
            'cidade'      => null,
            'uf'          => null,
            'numero'      => null,
            'complemento' => null,
        ]);
    }
}
