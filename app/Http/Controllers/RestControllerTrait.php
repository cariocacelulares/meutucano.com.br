<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

/**
 * Class RestControllerTrait
 * @package App\Http\Controllers
 */
trait RestControllerTrait
{
    use RestResponseTrait;

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $m = self::MODEL;
        $m = new $m;

        return $this->listResponse($m::all());
    }

    /**
     * Filter
     */
    protected function handleRequest($m)
    {
        /**
         * Filter
         */
        if (Input::get('filter')) {
            foreach (json_decode(Input::get('filter'), true) as $filtro) {
                if ($filtro['operator'] == 'LIKE') {
                    $filtro['value'] = '%' . $filtro['value'] . '%';
                }

                if (\DateTime::createFromFormat('d/m/Y', $filtro['value']) !== false) {
                    $m = $m->whereDate(
                        $filtro['column'],
                        $filtro['operator'],
                        Carbon::createFromFormat('d/m/Y', $filtro['value'])->format('Y-m-d')
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
        return $m->paginate(Input::get('per_page', 20), Input::get('fields') ? json_decode(Input::get('fields'), true) : ['*']);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $m = self::MODEL;
        if($data = $m::find($id)) {
            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if($v->fails()) {
                throw new \Exception("ValidationException");
            }
            $data = $m::create(Input::all());
            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
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

            $data->fill($this->handleInputData(Input::all()));
            $data->save();
            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        $m = self::MODEL;
        if(!$data = $m::find($id))
        {
            return $this->notFoundResponse();
        }
        $data->delete();
        return $this->deletedResponse();
    }

    private function handleInputData($inputs)
    {
        $skip = ['created_at', 'updated_at', 'deleted_at'];

        foreach ($inputs as $key => $value) {
            if ($value && is_string($value) && \DateTime::createFromFormat('d/m/Y', $value) !== false) {
                $originalKey = str_replace('_readable', '', $key);

                if (in_array($originalKey, $skip))
                    continue;

                if (array_key_exists($originalKey, $inputs)) {
                    $inputs[$originalKey] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
                    $skip[] = $originalKey;
                }
            }
        }

        return $inputs;
    }
}