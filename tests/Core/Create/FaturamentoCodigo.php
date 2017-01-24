<?php namespace Tests\Core\Create;

use Core\Models\Pedido\FaturamentoCodigo as FaturamentoCodigoModel;

class FaturamentoCodigo
{
    /**
    * Cria um objeto de fataturamento codigo
    *
    * @return Core\Models\Produto
    */
    public static function create($data = [])
    {
        return factory(FaturamentoCodigoModel::class)->create($data);
    }

    /**
    * Gera os dois tipos de codigo de FaturamentoCodigo caso não existam
    *
    * @return void
    */
    public static function generate()
    {
        if (!FaturamentoCodigoModel::find(0)) {
            FaturamentoCodigoModel::create([
                'servico' => 0,
            ]);
        }

        if (!FaturamentoCodigoModel::find(1)) {
            FaturamentoCodigoModel::create([
                'servico' => 1,
            ]);
        }
    }
}
