<?php namespace Core\Http\Controllers\Cliente;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Cliente\Cliente;
use Core\Models\Cliente\Endereco;
use Illuminate\Support\Facades\Input;

/**
 * Class ClienteController
 * @package Core\Http\Controllers\Cliente
 */
class ClienteController extends Controller
{
    use RestControllerTrait;

    const MODEL = Cliente::class;

    protected $validationRules = [];

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;

        $list = $m::orderBy('clientes.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function detail($id)
    {
        $m = self::MODEL;
        $data = $m::with(['pedidos', 'enderecos'])->find($id);

        if ($data) {
            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

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
        } catch (\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
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
        $m = self::MODEL;

        try {
            $email = \Request::get('email');

            $data = $m::find($cliente_id);
            $data->email = $email;
            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
