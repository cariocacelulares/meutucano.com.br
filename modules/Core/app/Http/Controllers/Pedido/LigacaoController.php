<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Input;
use Core\Models\Pedido\Ligacao;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Http\Requests\LigacaoRequest as Request;
use Core\Transformers\LigacaoTransformer;

/**
 * Class LigacaoController
 * @package Core\Http\Controllers\Pedido
 */
class LigacaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Ligacao::class;

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function ligacoesFromOrder($pedido_id)
    {
        $data = (self::MODEL)
            ::where('pedido_id', $pedido_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->listResponse(LigacaoTransformer::list($data));
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        $m = self::MODEL;

        try {
            $path    = 'ligacoes';
            $arquivo = Input::file('arquivo');
            $user    = getCurrentUserId();

            if ($arquivo && in_array($arquivo->getClientOriginalExtension(), ['wav', 'mp3'])) {
                $nomeArquivo = str_slug(Input::get('pedido_id') . " {$user} " . date('Ymd His'));
                $nomeArquivo = $nomeArquivo . '.' . $arquivo->getClientOriginalExtension();

                if (!$arquivo->move(storage_path($path), $nomeArquivo)) {
                    return $this->clientErrorResponse($data);
                }
            }

            $data = $m::create(array_merge(
                \Request::all(), [
                    'usuario_id' => $user,
                    'arquivo'    => $path . '/' . $nomeArquivo
                ]
            ));

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            $data = ['exception' => $exception->getMessage()];

            return $this->clientErrorResponse($data);
        }
    }
}
