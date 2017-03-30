<?php namespace Tests\Rastreio\Create;

use Rastreio\Models\Rastreio as RastreioModel;
use Tests\Core\Create\Pedido;

class Rastreio
{
    /**
    * Cria um objeto de rastreio
    *
    * @return Rastreio\Models
    */
    public static function create($data = [])
    {
        if (!isset($data['pedido_id'])) {
            $data['pedido_id'] = Pedido::create()->id;
        }

        return factory(RastreioModel::class)->create(array_merge([
            'rastreio'  => 'DN677968684BR',
            'servico'   => 'sedex'
        ], $data));
    }
}
