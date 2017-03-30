<?php namespace Tests\Rastreio\Create;

use Rastreio\Models\Logistica as LogisticaModel;
use Tests\Core\Create\Pedido;

class Logistica
{
    /**
    * Cria um objeto de rastreio
    *
    * @return Rastreio\Models\Logistica
    */
    public static function create($data = [])
    {
        if (!isset($data['rastreio_id'])) {
            $data['rastreio_id'] = Rastreio::create()->id;
        }

        return factory(LogisticaModel::class)->create($data);
    }
}
