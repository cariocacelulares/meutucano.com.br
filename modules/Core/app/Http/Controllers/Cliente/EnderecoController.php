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

    public function __construct()
    {
        $this->middleware('permission:customer_address_list', ['only' => ['index']]);
        $this->middleware('permission:customer_address_show', ['only' => ['show']]);
        $this->middleware('permission:customer_address_create', ['only' => ['store']]);
        $this->middleware('permission:customer_address_update', ['only' => ['update']]);
        $this->middleware('permission:customer_address_delete', ['only' => ['destroy']]);
    }

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

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
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
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function byClient($clientId)
    {
        $this->middleware('permission:customer_address_list');

        try {
            $enderecos = Endereco::where('cliente_id', '=', $clientId)
                ->get();

            return $this->listResponse($enderecos);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
