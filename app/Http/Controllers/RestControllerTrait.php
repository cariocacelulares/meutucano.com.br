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

        $list = $this->handleRequest($m);

        return $this->listResponse($list);
    }

    /**
     * Filter
     */
    protected function handleRequest($m)
    {
        /**
         * Join
         */
        if (Input::get('join')) {
            foreach (json_decode(Input::get('join'), true) as $join) {
                $m = $m->join(
                    $join['table'],
                    $join['onTable'],
                    $join['operator'],
                    $join['targetTable'],
                    array_key_exists('type', $join) ? $join['type'] : 'inner'
                );
            }
        }

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
         * Order
         */
        if (Input::get('orderBy')) {
            $m = $m->orderBy(Input::get('orderBy'), Input::get('order', 'ASC'));
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
    public function store(Request $request)
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make($request->all(), $this->validationRules);

            if($v->fails()) {
                throw new \Exception("ValidationException");
            }
            $data = $m::create(\Request::all());
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

        if(!$data = $m::find($id))
        {
            return $this->notFoundResponse();
        }

        try
        {
            $v = \Validator::make(\Request::all(), $this->validationRules);

            if($v->fails())
            {
                throw new \Exception("ValidationException");
            }
            $data->fill(\Request::all());
            $data->save();
            return $this->showResponse($data);
        }catch(\Exception $ex)
        {
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

}
