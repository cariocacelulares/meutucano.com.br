<?php namespace Core\Http\Controllers;

use App\Http\Controllers\Controller;

class ZipcodeController extends Controller
{
    /**
     * Get address by zipcode
     *
     * @param  string $cep
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getAddress($cep)
    {
        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "https://viacep.com.br/ws/{$cep}/json/");
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            $address = curl_exec($curl);
            curl_close($curl);

            $address = json_decode($address);

            return showResponse([
                'zipcode'    => $address->cep,
                'street'     => $address->logradouro,
                'district'   => $address->bairro,
                'city'       => $address->localidade,
                'state'      => $address->uf,
                'complement' => $address->complemento
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro a tentar obter um endereço via CEP.'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
