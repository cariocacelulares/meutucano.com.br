<?php namespace Tests\Core\Create;

use Core\Models\Cliente\Endereco as EnderecoModel;

class Endereco
{
    /**
    * Cria um objeto de endereco
    *
    * @return Core\Models\Endereco
    */
    public static function create($data = [])
    {
        if (!isset($data['cliente_id'])) {
            $data['cliente_id'] = Cliente::create()->id;
        }

        return factory(EnderecoModel::class)->create($data);
    }
}
