<?php namespace Core\Http\Controllers\Depot;

use Core\Models\Depot;
use App\Http\Controllers\Controller;
use Core\Http\Requests\DepotRequest as Request;
use App\Http\Controllers\Rest\RestControllerTrait;

class DepotController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:depot_list', ['only' => ['index']]);
        $this->middleware('permission:depot_show', ['only' => ['show']]);
        $this->middleware('permission:depot_create', ['only' => ['store']]);
        $this->middleware('permission:depot_update', ['only' => ['update']]);
        $this->middleware('permission:depot_delete', ['only' => ['destroy']]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = Depot::orderBy('priority', 'ASC');

        return tableListResponse($data);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = Depot::findOrFail($id);

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = Depot::create($request->all());

            return createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $data = Depot::findOrFail($id);
            $data->fill($request->all());
            $data->save();

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = Depot::with(['depotProducts'])->findOrFail($id);

            if ($data->depotProducts->max('quantity') != 0) {
                return clientErrorResponse([
                    'message' => 'Um ou mais produtos do depósito possuem quantidade em estoque, realize uma transferência antes de deletar o depósito'
                ]);
            }

            $data->delete();

            return deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
