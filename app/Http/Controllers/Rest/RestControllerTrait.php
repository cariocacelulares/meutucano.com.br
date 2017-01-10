<?php namespace App\Http\Controllers\Rest;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

/**
 * Class RestControllerTrait
 * @package App\Http\Controllers\Rest
 */
trait RestControllerTrait
{
    use RestResponseTrait;

    /**
     * Retorna uma lista de todos recursos
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $m = self::MODEL;
        $m = new $m;

        return $this->listResponse($m::all());
    }

    /**
     * Manipula a requisição para listagem
     *
     * @param  EloquentBuilder $m
     * @return array
     */
    protected function handleRequest($m, $fields = ['*'])
    {
        /**
         * Filter
         */
        if (Input::get('filter')) {
            foreach (json_decode(Input::get('filter'), true) as $filtro) {
                if ($filtro['operator'] == 'LIKE') {
                    $filtro['value'] = '%' . $filtro['value'] . '%';
                }

                if ($filtro['operator'] == 'BETWEEN' && !is_array($filtro['value'])) {
                    $filtro['operator'] = '=';
                }

                if ($filtro['operator'] == 'BETWEEN') {
                    if ((!isset($filtro['value']['to']) || (!$filtro['value']['to'] && $filtro['value']['to'] !== 0)) && isset($filtro['value']['from'])) {
                        $filtro['operator'] = '>=';
                        $filtro['value']    = $filtro['value']['from'];
                    } elseif ((!isset($filtro['value']['from']) || (!$filtro['value']['from'] && $filtro['value']['from'] !== 0)) && isset($filtro['value']['to'])) {
                        $filtro['operator'] = '<=';
                        $filtro['value']    = $filtro['value']['to'];
                    }
                }

                if ($filtro['operator'] == 'BETWEEN') {
                    foreach ($filtro['value'] as $key => $value) {
                        if (is_string($value) && \DateTime::createFromFormat('d/m/Y', $value) !== false) {
                            $filtro['value'][$key] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
                        }
                    }

                    $m = $m->whereBetween(
                        $filtro['column'],
                        [
                            $filtro['value']['from'],
                            $filtro['value']['to']
                        ]
                    );
                } elseif (is_string($filtro['value']) && \DateTime::createFromFormat('d/m/Y', $filtro['value']) !== false) {
                    $m = $m->whereDate(
                        $filtro['column'],
                        $filtro['operator'],
                        Carbon::createFromFormat('d/m/Y', $filtro['value'])->format('Y-m-d')
                    );
                } else if ($filtro['operator'] == 'IN') {
                    $m = $m->whereIn(
                        $filtro['column'],
                        $filtro['value']
                    );
                } else {
                    $m = $m->where(
                        $filtro['column'],
                        $filtro['operator'],
                        $filtro['value']
                    );
                }
            }
        }

        /**
         * Pagination
         */
        return $m->paginate(
            Input::get('per_page', 20),
            Input::get('fields') ? json_decode(Input::get('fields'), true) : $fields
        );
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            return $this->showResponse((self::MODEL)::findOrFail($id));
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => strstr(get_class($exception), 'ModelNotFoundException')
                    ? 'Recurso nao encontrado'
                    : $exception->getMessage()
            ]);
        }
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        try {
            $data = (self::MODEL)::create(Input::all());

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
    public function update($id)
    {
        try {
            $data = (self::MODEL)::findOrFail($id);
            $data->fill(Input::all());
            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => strstr(get_class($exception), 'ModelNotFoundException')
                    ? 'Recurso nao encontrado'
                    : $exception->getMessage()
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
            $data = (self::MODEL)::findOrFail($id);
            $data->delete();

            return $this->deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => strstr(get_class($exception), 'ModelNotFoundException')
                    ? 'Recurso nao encontrado'
                    : $exception->getMessage()
            ]);
        }
    }
}
