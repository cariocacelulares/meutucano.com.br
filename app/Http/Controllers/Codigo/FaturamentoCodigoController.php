<?php namespace App\Http\Controllers\Codigo;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\FaturamentoCodigo;
use Illuminate\Support\Facades\Input;
use PhpSigep\Model\Etiqueta;

class FaturamentoCodigoController extends Controller
{
    use RestResponseTrait;

    /**
     * Generate rastreio code
     *
     * @param $servico
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function generateCode($servico)
    {
        $codigo = FaturamentoCodigo::find($servico);

        $response = [];
        if (($codigo->atual + 1) > $codigo->fim) {
            $response['error'] = 'Os códigos para esse serviço esgotaram!';
        } else {
            if (($restante = ($codigo->fim - $codigo->atual)) <= 500) {
                $response['msg'] = sprintf('Existem apenas %d códigos disponíveis.', $restante);
            }

            $codigo->atual = ($codigo->atual + 1);
            $codigo->save();

            $servico = ($servico == 0) ? 'PE' : 'DN';

            $etiqueta = new Etiqueta();
            $etiqueta->setEtiquetaSemDv($servico . $codigo->atual);

            $response['codigo'] = $etiqueta->getEtiquetaComDv() . 'BR';
        }

        return $this->showResponse($response);
    }
}
