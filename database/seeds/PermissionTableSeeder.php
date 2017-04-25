<?php

use Illuminate\Database\Seeder;
use App\Models\Usuario\Permission;

class PermissionTableSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'name' => 'see_price_graphs',
                'display_name' => 'Ver dados de gráficos e faturamento',
            ],
            [
                'name' => 'order_list',
                'display_name' => 'Listar pedidos',
            ],
            [
                'name' => 'order_show',
                'display_name' => 'Visualizar pedido',
            ],
            [
                'name' => 'order_create',
                'display_name' => 'Criar pedido',
            ],
            [
                'name' => 'order_update',
                'display_name' => 'Alterar pedido',
            ],
            [
                'name' => 'order_approve',
                'display_name' => 'Aprovar pedido',
            ],
            [
                'name' => 'order_cancel',
                'display_name' => 'Cancelar pedido',
            ],
            [
                'name' => 'order_comment_list',
                'display_name' => 'Listar comentários de pedido',
            ],
            [
                'name' => 'order_comment_create',
                'display_name' => 'Criar comentário de pedido',
            ],
            [
                'name' => 'order_comment_delete',
                'display_name' => 'Deletar comentário de pedido',
            ],
            [
                'name' => 'order_call_list',
                'display_name' => 'Listar ligações de pedido',
            ],
            [
                'name' => 'order_call_create',
                'display_name' => 'Criar ligação de pedido',
            ],
            [
                'name' => 'order_call_delete',
                'display_name' => 'Deletar ligação de pedido',
            ],
            [
                'name' => 'order_invoice_list',
                'display_name' => 'Listar notas fiscais',
            ],
            [
                'name' => 'order_invoice_create',
                'display_name' => 'Criar/importar notas fiscais',
            ],
            [
                'name' => 'order_invoice_delete',
                'display_name' => 'Deletar notas fiscais',
            ],
            [
                'name' => 'order_invoice_print',
                'display_name' => 'Imprimir DANFe das notas fiscais',
            ],
            [
                'name' => 'order_invoice_devolution',
                'display_name' => 'Criar/importar devoluções de notas fiscais',
            ],
            [
                'name' => 'order_shipment_list',
                'display_name' => 'Listar rastreios',
            ],
            [
                'name' => 'order_shipment_create',
                'display_name' => 'Criar/importar rastreios',
            ],
            [
                'name' => 'order_shipment_delete',
                'display_name' => 'Deletar rastreios',
            ],
            [
                'name' => 'order_shipment_print',
                'display_name' => 'Imprimir etiqueta de rastreio',
            ],
            [
                'name' => 'order_shipment_important_list',
                'display_name' => 'Listar rastreios com pendências logísticas',
            ],
            [
                'name' => 'order_shipment_logistic_show',
                'display_name' => 'Visalizar logística reversa',
            ],
            [
                'name' => 'order_shipment_logistic_create',
                'display_name' => 'Criar logística reversa',
            ],
            [
                'name' => 'order_shipment_logistic_update',
                'display_name' => 'Alterar logística reversa',
            ],
            [
                'name' => 'order_shipment_logistic_delete',
                'display_name' => 'Deletar logística reversa',
            ],
            [
                'name' => 'order_shipment_devolution_show',
                'display_name' => 'Visualizar devolução do rastreio',
            ],
            [
                'name' => 'order_shipment_devolution_create',
                'display_name' => 'Criar devolução do rastreio',
            ],
            [
                'name' => 'order_shipment_devolution_update',
                'display_name' => 'Alterar devolução do rastreio',
            ],
            [
                'name' => 'order_shipment_devolution_delete',
                'display_name' => 'Deletar devolução do rastreio',
            ],
            [
                'name' => 'order_shipment_issue_show',
                'display_name' => 'Visualizar pedido de informação',
            ],
            [
                'name' => 'order_shipment_issue_create',
                'display_name' => 'Criar pedido de informação',
            ],
            [
                'name' => 'order_shipment_issue_update',
                'display_name' => 'Alterar pedido de informação',
            ],
            [
                'name' => 'order_shipment_issue_delete',
                'display_name' => 'Deletar pedido de informação',
            ],
            [
                'name' => 'order_shipment_monitor',
                'display_name' => 'Monitorar rastreios',
            ],
            [
                'name' => 'customer_list',
                'display_name' => 'Listar clientes',
            ],
            [
                'name' => 'customer_show',
                'display_name' => 'Visualizar cliente',
            ],
            [
                'name' => 'customer_create',
                'display_name' => 'Criar cliente',
            ],
            [
                'name' => 'customer_update',
                'display_name' => 'Alterar cliente',
            ],
            [
                'name' => 'customer_delete',
                'display_name' => 'Deletar cliente',
            ],
            [
                'name' => 'customer_address_list',
                'display_name' => 'Listar endereços do cliente',
            ],
            [
                'name' => 'customer_address_show',
                'display_name' => 'Visualizar endereço do cliente',
            ],
            [
                'name' => 'customer_address_create',
                'display_name' => 'Criar endereço do cliente',
            ],
            [
                'name' => 'customer_address_update',
                'display_name' => 'Alterar endereço do cliente',
            ],
            [
                'name' => 'customer_address_delete',
                'display_name' => 'Deletar endereço do cliente',
            ],
            [
                'name' => 'brand_list',
                'display_name' => 'Listar marcas de produtos',
            ],
            [
                'name' => 'brand_create',
                'display_name' => 'Criar marca de produto'
            ],
            [
                'name' => 'brand_update',
                'display_name' => 'Alterar marca de produto',
            ],
            [
                'name' => 'brand_delete',
                'display_name' => 'Deletar marca de produto',
            ],
            [
                'name' => 'line_list',
                'display_name' => 'Listar linhas de produto',
            ],
            [
                'name' => 'line_create',
                'display_name' => 'Criar linha de produto'
            ],
            [
                'name' => 'line_update',
                'display_name' => 'Alterar linha de produto',
            ],
            [
                'name' => 'line_delete',
                'display_name' => 'Deletar linha de produto',
            ],
            [
                'name' => 'product_list',
                'display_name' => 'Listar produtos',
            ],
            [
                'name' => 'product_list_cost',
                'display_name' => 'Visualizar custo do produto',
            ],
            [
                'name' => 'product_show',
                'display_name' => 'Visualizar produto',
            ],
            [
                'name' => 'product_create',
                'display_name' => 'Criar produto',
            ],
            [
                'name' => 'product_update',
                'display_name' => 'Alterar produto',
            ],
            [
                'name' => 'product_delete',
                'display_name' => 'Deletar produto',
            ],
            [
                'name' => 'product_generate_sku',
                'display_name' => 'Alterar SKU do produto',
            ],
            [
                'name' => 'depot_list',
                'display_name' => 'Listar depósitos de estoque',
            ],
            [
                'name' => 'depot_show',
                'display_name' => 'Visualizar depósito',
            ],
            [
                'name' => 'depot_create',
                'display_name' => 'Criar depósito',
            ],
            [
                'name' => 'depot_update',
                'display_name' => 'Alterar depósito',
            ],
            [
                'name' => 'depot_delete',
                'display_name' => 'Deletar depósito',
            ],
            [
                'name' => 'depot_transfer',
                'display_name' => 'Transferir estoque do depósito',
            ],
            [
                'name' => 'withdraw_list',
                'display_name' => 'Listar todas retiradas de estoque',
            ],
            [
                'name' => 'withdraw_list_mine',
                'display_name' => 'Listar minhas retiradas de estoque',
            ],
            [
                'name' => 'withdraw_show',
                'display_name' => 'Visualizar detalhes da retirada',
            ],
            [
                'name' => 'withdraw_create',
                'display_name' => 'Criar retirada de estoque',
            ],
            [
                'name' => 'withdraw_update',
                'display_name' => 'Alterar retirada de estoque',
            ],
            [
                'name' => 'withdraw_return',
                'display_name' => 'Retornar produtos para retirada de estoque',
            ],
            [
                'name' => 'withdraw_close',
                'display_name' => 'Fechar retirada de estoque',
            ],
            [
                'name' => 'supplier_list',
                'display_name' => 'Listar fornecedores',
            ],
            [
                'name' => 'supplier_show',
                'display_name' => 'Visualizar fornecedor',
            ],
            [
                'name' => 'supplier_create',
                'display_name' => 'Criar fornecedor',
            ],
            [
                'name' => 'supplier_update',
                'display_name' => 'Alterar fornecedor',
            ],
            [
                'name' => 'supplier_delete',
                'display_name' => 'Deletar fornecedor',
            ],
            [
                'name' => 'serial_generate',
                'display_name' => 'Gerar Seriais',
            ],
            [
                'name' => 'entry_list',
                'display_name' => 'Listar entradas de estoque',
            ],
            [
                'name' => 'entry_list_mine',
                'display_name' => 'Listar entradas de estoque do usuário'
            ],
            [
                'name' => 'entry_show',
                'display_name' => 'Visualizar detalhes da entrada de estoque',
            ],
            [
                'name' => 'entry_create',
                'display_name' => 'Importar entrada de estoque',
            ],
            [
                'name' => 'entry_manual',
                'display_name' => 'Criar entrada de estoque manual',
            ],
            [
                'name' => 'entry_update',
                'display_name' => 'Alterar entrada de estoque',
            ],
            [
                'name' => 'entry_delete',
                'display_name' => 'Deletar entrada de estoque',
            ],
            [
                'name' => 'entry_confirm',
                'display_name' => 'Confirmar entradas de estoque',
            ],
            [
                'name' => 'product_defect_list',
                'display_name' => 'Listar produtos em defeito',
            ],
            [
                'name' => 'product_defect_create',
                'display_name' => 'Marcar produto como defeito',
            ],
            [
                'name' => 'product_defect_return',
                'display_name' => 'Retornar produto defeituoso ao estoque',
            ],
            [
                'name' => 'user_list',
                'display_name' => 'Listar usuários',
            ],
            [
                'name' => 'user_show',
                'display_name' => 'Visualizar detalhes do usuário',
            ],
            [
                'name' => 'user_create',
                'display_name' => 'Criar usuário',
            ],
            [
                'name' => 'user_update',
                'display_name' => 'Alterar usuário',
            ],
            [
                'name' => 'user_delete',
                'display_name' => 'Deletar usuário',
            ],
            [
                'name' => 'user_profile_show',
                'display_name' => 'Ver perfil do usuário',
            ],
            [
                'name' => 'user_profile_update',
                'display_name' => 'Editar informações do perfil',
            ],
            [
                'name' => 'user_password_list',
                'display_name' => 'Listar todas senhas',
            ],
            [
                'name' => 'user_password_list_mine',
                'display_name' => 'Listar senhas do usuário',
            ],
            [
                'name' => 'user_password_create',
                'display_name' => 'Criar senha',
            ],
            [
                'name' => 'user_password_update',
                'display_name' => 'Alterar senha',
            ],
            [
                'name' => 'user_password_delete',
                'display_name' => 'Deletar senha',
            ],
            [
                'name' => 'role_list',
                'display_name' => 'Listar regras de permissão',
            ],
            [
                'name' => 'role_create',
                'display_name' => 'Criar regra de permissão'
            ],
            [
                'name' => 'role_update',
                'display_name' => 'Alterar regra de permissão',
            ],
            [
                'name' => 'role_delete',
                'display_name' => 'Deletar regra de permissão',
            ],
            [
                'name' => 'permission_list',
                'display_name' => 'Listar permissões de usuários',
            ]
        ];

        Permission::insert($data);
    }
}
