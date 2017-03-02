<?php namespace Tests\Core\Create;

use Tests\CreateUsuario;
use Core\Models\Stock\Issue as IssueModel;

class Issue
{
    /**
    * Create a Issue register
    *
    * @return Core\Models\Stock\Issue
    */
    public static function create($data = [])
    {
        if (!isset($data['user_id'])) {
            $user = CreateUsuario::create();
            $data['user_id'] = $user->id;
        }

        if (!isset($data['product_imei_id'])) {
            $productImei = ProductImei::create();
            $data['product_imei_id'] = $productImei->id;
        }

        return factory(IssueModel::class)->create($data);
    }
}
