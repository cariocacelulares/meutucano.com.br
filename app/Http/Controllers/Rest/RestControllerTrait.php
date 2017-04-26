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
     * Return a list of all resources
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $model = self::MODEL;
        $list = $this->handleRequest(new $model);

        return $this->listResponse($list);
    }

    /**
     * Manipulate the request to the list
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
            foreach (json_decode(Input::get('filter'), true) as $filter) {
                if ($filter['operator'] == 'LIKE') {
                    $filter['value'] = '%' . $filter['value'] . '%';
                }

                if ($filter['operator'] == 'BETWEEN' && !is_array($filter['value'])) {
                    $filter['operator'] = '=';
                }

                if ($filter['operator'] == 'BETWEEN') {
                    if ((!isset($filter['value']['to']) || (!$filter['value']['to'] && $filter['value']['to'] !== 0)) && isset($filter['value']['from'])) {
                        $filter['operator'] = '>=';
                        $filter['value']    = $filter['value']['from'];
                    } elseif ((!isset($filter['value']['from']) || (!$filter['value']['from'] && $filter['value']['from'] !== 0)) && isset($filter['value']['to'])) {
                        $filter['operator'] = '<=';
                        $filter['value']    = $filter['value']['to'];
                    }
                }

                if ($filter['operator'] == 'BETWEEN') {
                    foreach ($filter['value'] as $key => $value) {
                        if (is_string($value) && \DateTime::createFromFormat('d/m/Y', $value) !== false) {
                            $filter['value'][$key] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
                        }
                    }

                    $m = $m->whereBetween(
                        $filter['column'],
                        [
                            $filter['value']['from'],
                            $filter['value']['to']
                        ]
                    );
                } elseif (is_string($filter['value']) && \DateTime::createFromFormat('d/m/Y', $filter['value']) !== false) {
                    $m = $m->whereDate(
                        $filter['column'],
                        $filter['operator'],
                        Carbon::createFromFormat('d/m/Y', $filter['value'])->format('Y-m-d')
                    );
                } else if ($filter['operator'] == 'IN') {
                    $m = $m->whereIn(
                        $filter['column'],
                        $filter['value']
                    );
                } else {
                    $m = $m->where(
                        $filter['column'],
                        $filter['operator'],
                        $filter['value']
                    );
                }
            }
        }

        /**
         * Pagination
         */
        return $m->paginate(
            Input::get('per_page', 10),
            Input::get('fields') ? json_decode(Input::get('fields'), true) : $fields
        );
    }

    /**
     * Returns a unique resource
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
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Create a new resource
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

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Update a resource
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
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Deletes a resource
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
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
