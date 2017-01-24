<?php namespace Tests\Rastreio\Create;

use Rastreio\Models\Devolucao as DevolucaoModel;
use Tests\Core\Create\Pedido;

class Devolucao
{
    /**
    * Cria um objeto de rastreio
    *
    * @return Rastreio\Models\Devolucao
    */
    public static function create($data = [])
    {
        if (!isset($data['rastreio_id'])) {
            $data['rastreio_id'] = Rastreio::create()->id;
        }

        return factory(DevolucaoModel::class)->create($data);
    }
}
