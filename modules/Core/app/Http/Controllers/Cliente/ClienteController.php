<?php namespace Core\Http\Controllers\Cliente;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Transformers\ClientTransformer;
use Core\Http\Requests\ClientRequest as Request;

/**
 * Class ClienteController
 * @package Core\Http\Controllers\Cliente
 */
class ClienteController extends Controller
{
    use RestControllerTrait;

    const MODEL = Cliente::class;

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)::orderBy('clientes.created_at', 'DESC');
        $list = $this->handleRequest($list);

        return $this->listResponse(ClientTransformer::tableList($list));
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function detail($id)
    {
        $data = (self::MODEL)::with(['pedidos', 'enderecos'])->find($id);

        if ($data) {
            return $this->showResponse(ClientTransformer::show($data));
        }

        return $this->notFoundResponse();
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
            $data = Input::except(['enderecos']);

            if (isset($data['taxvat'])) {
                $data['taxvat'] = numbers($data['taxvat']);

                if (strlen($data['taxvat']) > 11) {
                    $data['tipo'] = 1;
                } else {
                    $data['tipo'] = 0;
                }
            }

            $cliente = (self::MODEL)::create($data);

            $enderecos = [];
            foreach ((Input::get('enderecos') ?: []) as $endereco) {
                $enderecos[] = new Endereco($endereco);
            }

            $cliente->enderecos()->saveMany($enderecos);

            $cliente = (self::MODEL)
                ::where('id', '=', $cliente->id)
                ->with('enderecos')
                ->first();

            return $this->createdResponse($cliente);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id, Request $request)
    {
        if (!$data = (self::MODEL)::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $data->fill(Input::except('enderecos'));
            $data->save();

            $enderecos = Input::get('enderecos');
            if ($enderecos) {
                foreach ($enderecos as $endereco) {
                    $obj = Endereco::find($endereco['id']);
                    if ($obj) {
                        $obj->fill($endereco);
                        $obj->save();
                    }
                }
            }

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Altera o e-mail do cliente
     *
     * @param  int $cliente_id
     * @return  \Symfony\Component\HttpFoundation\Response
     */
    public function changeEmail($cliente_id)
    {
        try {
            $email = \Request::get('email');

            $data = (self::MODEL)::find($cliente_id);
            $data->email = $email;
            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Search clients by taxvat and name based on term
     *
     * @param  string $term
     * @return Object
     */
    public function search($term)
    {
        try {
            $list = (self::MODEL)
                ::with('enderecos')
                ->where('nome', 'LIKE', "%{$term}%")
                ->orWhere('taxvat', 'LIKE', "%{$term}%")
                ->get();

            return $this->listResponse(ClientTransformer::directSearch($list));
        } catch (\Exception $exception) {
            return $this->listResponse([]);
        }
    }
}
