<?php namespace Tests;

use App\Models\PedidoNota;

trait RestTestTrait
{
    /**
     * Test if index method returns collection of objects
     *
     * @return void
     */
    public function test__it_should_return_collection_of_objects()
    {
        $response = $this->action('GET', self::CONTROLLER . '@index',
            [], [], [], [], ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->getData(true);

        $this->assertArraySubset([
            'code'   => 200,
            'status' => 'success',
        ], $response);

        $this->assertGreaterThan(0, sizeof($response['data']));
    }

    /**
     * Test if show method returns object
     *
     * @return void
     */
    public function test__it_should_return_an_instance_of_object()
    {
        $response = $this->action('GET', self::CONTROLLER . '@show',
            ['id' => 1], [], [], [], ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->getData(true);

        $this->assertArraySubset([
            'code'   => 200,
            'status' => 'success',
        ], $response);
    }

    /**
     * Test if show method returns object
     *
     * @return void
     */
    public function test__it_should_create_new_instace_of_model()
    {
        $c     = self::CONTROLLER;
        $model = $c::MODEL;

        PedidoNota::destroy(1);
        $modelFactory = factory($model)->make();
        $attrs = $modelFactory->getAttributes();

        $response = $this->action('POST', self::CONTROLLER . '@store',
            [], $attrs, [], [], ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->getData(true);

        $this->assertArraySubset([
            'code'   => 201,
            'status' => 'success',
        ], $response);
    }

    /**
     * Test if show method returns object
     *
     * @return void
     */
    public function test__it_should_update_model()
    {
        $c     = self::CONTROLLER;
        $model = $c::MODEL;

        $modelFactory = factory($model)->make();
        $attrs = $modelFactory->getAttributes();

        $response = $this->action('PUT', self::CONTROLLER . '@update',
            ['id' => 1], $attrs, [], [], ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->getData(true);

        $this->assertArraySubset([
            'code'   => 200,
            'status' => 'success',
        ], $response);
    }

    /**
     * Test if show method returns object
     *
     * @return void
     */
    public function test__it_should_delete_model()
    {
        $response = $this->action('DELETE', self::CONTROLLER . '@destroy',
            ['id' => 1], [], [], [], ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->getData(true);

        $this->assertArraySubset([
            'code'   => 204,
            'status' => 'success',
        ], $response);
    }
}
