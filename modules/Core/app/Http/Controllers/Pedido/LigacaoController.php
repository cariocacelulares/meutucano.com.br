<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Models\Pedido\Ligacao;
use Core\Transformers\LigacaoTransformer;
use Core\Http\Requests\LigacaoRequest as Request;

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

                if (!$arquivo->move(storage_path("app/public/{$path}"), $nomeArquivo)) {
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
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Deleta um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data    = (self::MODEL)::findOrFail($id);
            $arquivo = storage_path('app/public' . str_replace('storage/', '', $data->arquivo));

            File::delete($arquivo);

            $data->delete();

            return $this->deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
