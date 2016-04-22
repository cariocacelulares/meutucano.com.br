<?php namespace App\Http\Controllers\Meta;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\MetaMes;
use App\Models\MetaAno;
use Illuminate\Support\Facades\Input;

class MetaController extends Controller
{
    use RestResponseTrait;

    /**
     * Return meta from the year
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getMetaAno() {
        $ano = Input::get('ano', date('Y'));

        $metaAno = MetaAno::where(['ano' => $ano])->get();

        if ($metaAno) {
            $response = [
                'meta' => $metaAno,
            ];

            return $this->showResponse($response);
        }

        return $this->notFoundResponse();
    }

    /**
     * Return meta from the month
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMetaMes() {
        $ano = Input::get('ano', date('Y'));
        $mes = Input::get('mes', date('m'));

        $metaMesSmartphones = MetaMes::where([
            'ano'  => $ano,
            'mes'  => $mes,
            'tipo' => 0
        ])->get();

        $metaMesOutros = MetaMes::where([
            'ano'  => $ano,
            'mes'  => $mes,
            'tipo' => 1
        ])->get();

        if ($metaMesSmartphones && $metaMesOutros) {
            $response = [
                'smartphones' => $metaMesSmartphones,
                'outros'      => $metaMesOutros
            ];

            return $this->showResponse($response);
        }

        return $this->notFoundResponse();
    }
}