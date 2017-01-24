<?php namespace Tests\InspecaoTecnica\Create;

use Core\Models\Produto;
use InspecaoTecnica\Models\InspecaoTecnica as InspecaoTecnicaModel;
use Tests\CreateUsuario;
use Tests\Core\Create\Pedido;

class InspecaoTecnica
{
    /**
    * Cria um novo objeto de inspeção
    *
    * @return App\Models\Inspecao\InspecaoTecnica
    */
    public static function create($data = [])
    {
        $pedido = Pedido::create();

        return factory(InspecaoTecnicaModel::class)->create(array_merge($data, [
            'usuario_id'         => CreateUsuario::create()->id,
            'pedido_produtos_id' => $pedido->produtos()->first()->id,
            'produto_sku'        => $pedido->produtos()->first()->produto->sku,
        ]));
    }

    /**
    * Cria um novo objeto de inspeção sem relação com pedido
    *
    * @return App\Models\Inspecao\InspecaoTecnica
    */
    public static function createWithNoAssociation($data = [])
    {
        return factory(InspecaoTecnicaModel::class)->create(array_merge($data, [
            'usuario_id' => CreateUsuario::create()->id
        ]));
    }
}
