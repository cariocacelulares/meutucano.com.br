<?php namespace Core\Http\Controllers\Pedido;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use PhpSigep\Model\Etiqueta;
use Core\Models\Pedido\FaturamentoCodigo;

class FaturamentoCodigoController extends Controller
{
    use RestResponseTrait;

    /**
     * Generates a new traking code
     *
     * @param  string $servico pac ou sedex
     * @param  faturamentoCodigo $faturamentoCodigo
     * @return string
     */
    private function generateTrakingCode($servico, $faturamentoCodigo = null)
    {
        $faturamentoCodigo = $faturamentoCodigo ?: FaturamentoCodigo::findOrFail($servico);

        // se os códigos não foram esgotados
        if (($faturamentoCodigo->atual + 1) <= $faturamentoCodigo->fim) {
            $faturamentoCodigo->atual = ($faturamentoCodigo->atual + 1);
            $faturamentoCodigo->save();

            $servico = (isset(\Config::get('rastreio.servico')[$servico]))
                ? \Config::get('rastreio.servico')[$servico]
                : \Config::get('rastreio.codigo.pac');

            $etiqueta = new Etiqueta();
            $etiqueta->setEtiquetaSemDv($servico . $faturamentoCodigo->atual);

            return $etiqueta->getEtiquetaComDv() . 'BR';
        } else {
            return null;
        }
    }

    /**
     * Returns a new traking code
     *
     * @param  string $servico pac ou sedex
     * @return string
     */
    public function rawTrakingCode($servico)
    {
        return $this->generateTrakingCode($servico);
    }

    /**
     * Verify and generate a new traking code
     *
     * @param string $servico sedex ou pac
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getTrakingCode($servico)
    {
        $faturamentoCodigo = FaturamentoCodigo::findOrFail($servico);

        $response = [];
        if (($faturamentoCodigo->atual + 1) > $faturamentoCodigo->fim) {
            $response['error'] = 'Os códigos para esse serviço esgotaram!';
        } else {
            if (($restante = ($faturamentoCodigo->fim - $faturamentoCodigo->atual)) <= 500) {
                $response['msg'] = sprintf('Existem apenas %d códigos disponíveis.', $restante);
            }

            $response['codigo'] = $this->generateTrakingCode($servico, $faturamentoCodigo);
        }

        return $this->showResponse($response);
    }
}
