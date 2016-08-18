<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
        return $this->listResponse($m::take(20)->get());
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $m = self::MODEL;
        if($data = $m::find($id))
        {
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
