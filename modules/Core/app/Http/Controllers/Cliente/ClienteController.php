<?php namespace Core\Http\Controllers\Cliente;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Transformers\ClientTransformer;

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

        return $this->listResponse(ClientTransformer::list($list));
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
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
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
                'exception' => $exception->getMessage()
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
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
