<?php namespace Tests\Rastreio;

use Tests\Core\CreatePedido;
use Rastreio\Models\Rastreio;

class CreateRastreio
{
    /**
    * Cria um objeto de rastreio
    *
    * @return Rastreio\Models
    */
    public static function create($data = [])
    {
        return factory(Rastreio::class)->create(array_merge([
            'pedido_id' => CreatePedido::create()->id,
            'rastreio'  => 'DN677968684BR',
            'servico'   => 'sedex'
        ], $data));
    }
}
