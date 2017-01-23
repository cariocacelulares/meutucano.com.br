<?php namespace Core\Http\Controllers\Cliente;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Cliente\Endereco;
use Core\Models\Cliente;
use Core\Http\Requests\EnderecoRequest as Request;

/**
 * Class EnderecoController
 * @package Core\Http\Controllers\Cliente
 */
class EnderecoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Endereco::class;

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = Endereco::create(Input::all());

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse(['exception' => $exception->getMessage()]);
        }
    }

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id, Request $request)
    {
        try {
            $endereco = Endereco::findOrFail($id);
            $endereco->fill(Input::all());
            $endereco->save();

            return $this->showResponse($endereco);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => strstr(get_class($exception), 'ModelNotFoundException')
                    ? 'Recurso nao encontrado'
                    : $exception->getMessage()
            ]);
        }
    }
}
