<?php namespace Tests\Core;

use Core\Models\Pedido\FaturamentoCodigo;

class CreateFaturamentoCodigo
{
    /**
    * Cria um objeto de fataturamento codigo
    *
    * @return Core\Models\Produto
    */
    public static function create($data = [])
    {
        return factory(FaturamentoCodigo::class)->create($data);
    }

    /**
    * Gera os dois tipos de codigo de FaturamentoCodigo caso não existam
    *
    * @return void
    */
    public static function generate()
    {
        if (!FaturamentoCodigo::find(0)) {
            CreateFaturamentoCodigo::create([
                'servico' => 0,
            ]);
        }

        if (!FaturamentoCodigo::find(1)) {
            CreateFaturamentoCodigo::create([
                'servico' => 1,
            ]);
        }
    }
}
