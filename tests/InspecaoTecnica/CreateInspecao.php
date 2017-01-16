<?php namespace Tests\InspecaoTecnica;

use Tests\CreateUsuario;
use Tests\Core\CreatePedido;
use Core\Models\Produto\Produto;
use InspecaoTecnica\Models\InspecaoTecnica;

class CreateInspecao
{
    /**
    * Cria um novo objeto de inspeção
    *
    * @return App\Models\Inspecao\InspecaoTecnica
    */
    public static function create($data = [])
    {
        $pedido = CreatePedido::create();

        return factory(InspecaoTecnica::class)->create(array_merge($data, [
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
        return factory(InspecaoTecnica::class)->create(array_merge($data, [
            'usuario_id' => CreateUsuario::create()->id
        ]));
    }
}
