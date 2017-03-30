<?php namespace Tests\Rastreio\Create;

use Rastreio\Models\Pi as PiModel;
use Tests\Core\Create\Pedido;

class Pi
{
    /**
    * Cria um objeto de rastreio
    *
    * @return Rastreio\Models\Pi
    */
    public static function create($data = [])
    {
        if (!isset($data['rastreio_id'])) {
            $data['rastreio_id'] = Rastreio::create()->id;
        }

        return factory(PiModel::class)->create($data);
    }
}
