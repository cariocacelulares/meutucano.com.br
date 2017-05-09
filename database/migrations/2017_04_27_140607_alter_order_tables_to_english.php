<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterOrderTablesToEnglish extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
     public function up()
     {
         Schema::disableForeignKeyConstraints();

         /**
          * Orders
          */
         Schema::rename('pedidos', 'orders');
         Schema::table('orders', function(Blueprint $table) {
             $table->dropForeign('PedidoCliente');
             $table->dropForeign('PedidoClienteEndereco');
         });
         Schema::table('orders', function(Blueprint $table) {
             $table->dropColumn(['codigo_api', 'imagem_cancelamento', 'operacao']);

             $table->renameColumn('cliente_id', 'customer_id');
             $table->renameColumn('cliente_endereco_id', 'customer_address_id');
             $table->renameColumn('frete_valor', 'shipment_cost');
             $table->renameColumn('frete_metodo', 'shipment_method');
             $table->renameColumn('pagamento_metodo', 'payment_method');
             $table->renameColumn('parcelas', 'installments');
             $table->renameColumn('codigo_marketplace', 'api_code');
             $table->renameColumn('protocolo', 'cancel_protocol');
             $table->renameColumn('reembolso', 'refunded');
             $table->renameColumn('segurado', 'holded');
             $table->renameColumn('priorizado', 'priority');

             $table->foreign('customer_id')
                 ->references('id')
                 ->on('customers')
                 ->onUpdate('CASCADE')
                 ->onDelete('RESTRICT');

             $table->foreign('customer_address_id')
                 ->references('id')
                 ->on('customers')
                 ->onUpdate('CASCADE')
                 ->onDelete('RESTRICT');
         });

         /**
          * Users
          */
         Schema::rename('usuarios', 'users');
         Schema::table('users', function(Blueprint $table) {
             $table->dropColumn('username');
         });

         /**
          * User password
          */
         Schema::rename('usuario_senhas', 'user_passwords');
         Schema::table('user_passwords', function(Blueprint $table) {
             $table->dropForeign('UsuarioSenhaUsuario');
         });
         Schema::table('user_passwords', function(Blueprint $table) {
             $table->renameColumn('usuario_id', 'user_id');
             $table->renameColumn('site', 'description');
             $table->renameColumn('usuario', 'username');
             $table->renameColumn('senha', 'password');

             $table->foreign('user_id')
                 ->references('id')
                 ->on('users')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         /**
          * Order comments
          */
         Schema::rename('pedido_comentarios', 'order_comments');
         Schema::table('order_comments', function(Blueprint $table) {
             $table->dropForeign('PedidoComentariosPedido');
             $table->dropForeign('PedidoComentariosUsuario');
         });
         Schema::table('order_comments', function(Blueprint $table) {
             $table->renameColumn('pedido_id', 'order_id');
             $table->renameColumn('usuario_id', 'user_id');
             $table->renameColumn('comentario', 'comment');

             $table->foreign('order_id')
                 ->references('id')
                 ->on('orders')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');

             $table->foreign('user_id')
                 ->references('id')
                 ->on('users')
                 ->onUpdate('CASCADE')
                 ->onDelete('set null');
         });

         /**
          * Order taxes
          */
         Schema::rename('pedido_impostos', 'order_taxes');
         Schema::table('order_taxes', function(Blueprint $table) {
             $table->dropForeign('PedidoImpostoPedido');
         });
         Schema::table('order_taxes', function(Blueprint $table) {
             $table->renameColumn('pedido_id', 'order_id');
             $table->renameColumn('icms_destinatario', 'icms_to');
             $table->renameColumn('icms_remetente', 'icms_from');

             $table->foreign('order_id')
                 ->references('id')
                 ->on('orders')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         /**
          * Order calls
          */
         Schema::rename('pedido_ligacoes', 'order_calls');
         Schema::table('order_calls', function(Blueprint $table) {
             $table->dropForeign('PedidoLigacoesPedido');
             $table->dropForeign('PedidoLigacoesUsuario');
         });
         Schema::table('order_calls', function(Blueprint $table) {
             $table->renameColumn('pedido_id', 'order_id');
             $table->renameColumn('usuario_id', 'user_id');
             $table->renameColumn('arquivo', 'file');

             $table->foreign('order_id')
                 ->references('id')
                 ->on('orders')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');

             $table->foreign('user_id')
                 ->references('id')
                 ->on('users')
                 ->onUpdate('CASCADE')
                 ->onDelete('set null');
         });

         /**
          * Order invoices
          */
         Schema::rename('pedido_notas', 'order_invoices');
         Schema::table('order_invoices', function(Blueprint $table) {
             $table->dropForeign('PedidoNotaPedido');
             $table->dropForeign('UsuarioNotaUsuario');

             $table->unsignedInteger('usuario_id')->nullable()->change();
         });
         Schema::table('order_invoices', function(Blueprint $table) {
             $table->renameColumn('pedido_id', 'order_id');
             $table->renameColumn('usuario_id', 'user_id');
             $table->renameColumn('data', 'issued_at');
             $table->renameColumn('chave', 'key');
             $table->renameColumn('arquivo', 'file');
             $table->renameColumn('delete_note', 'note');

             $table->foreign('order_id')
                 ->references('id')
                 ->on('orders')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');

             $table->foreign('user_id')
                 ->references('id')
                 ->on('users')
                 ->onUpdate('CASCADE')
                 ->onDelete('set null');
         });

         /**
          * Order invoices devolutions
          */
         Schema::rename('pedido_nota_devolucoes', 'order_invoice_devolutions');
         Schema::table('order_invoice_devolutions', function(Blueprint $table) {
             $table->dropForeign('PedidoNotaDevolucaoUsuario');
             $table->dropForeign('PedidoNotaDevolucaoNota');

             $table->unsignedInteger('usuario_id')->nullable()->change();
         });
         Schema::table('order_invoice_devolutions', function(Blueprint $table) {
             $table->renameColumn('usuario_id', 'user_id');
             $table->renameColumn('nota_id', 'order_invoice_id');
             $table->renameColumn('data', 'issued_at');
             $table->renameColumn('chave', 'key');
             $table->renameColumn('arquivo', 'file');
             $table->renameColumn('tipo', 'type');
             $table->string('note')->nullable()->after('data');

             $table->foreign('order_invoice_id')
                 ->references('id')
                 ->on('order_invoices')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');

             $table->foreign('user_id')
                 ->references('id')
                 ->on('users')
                 ->onUpdate('CASCADE')
                 ->onDelete('set null');
         });

         /**
          * Order shipments
          */
         Schema::rename('pedido_rastreios', 'order_shipments');
         Schema::table('order_shipments', function(Blueprint $table) {
             $table->dropForeign('PedidoRastreioPedido');
         });
         Schema::table('order_shipments', function(Blueprint $table) {
             $table->renameColumn('pedido_id', 'order_id');
             $table->renameColumn('data_envio', 'sent_at');
             $table->renameColumn('rastreio', 'tracking_code');
             $table->renameColumn('servico', 'carrier');
             $table->renameColumn('valor', 'cost');
             $table->renameColumn('prazo', 'deadline');
             $table->renameColumn('imagem_historico', 'history_image');
             $table->renameColumn('delete_note', 'note');

             $table->foreign('order_id')
                 ->references('id')
                 ->on('orders')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         /**
          * Order shipment devolutions
          */
         Schema::rename('pedido_rastreio_devolucoes', 'order_shipment_devolutions');
         Schema::table('order_shipment_devolutions', function(Blueprint $table) {
             $table->dropForeign('DevolucaoPedidoRastreio');
         });
         Schema::table('order_shipment_devolutions', function(Blueprint $table) {
             $table->dropColumn('pago_cliente');

             $table->renameColumn('rastreio_id', 'order_shipment_id');
             $table->renameColumn('motivo', 'reason');
             $table->renameColumn('acao', 'action');
             $table->renameColumn('observacoes', 'note');

             $table->foreign('order_shipment_id')
                 ->references('id')
                 ->on('order_shipments')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         /**
          * Order shipment logistics
          */
         Schema::rename('pedido_rastreio_logisticas', 'order_shipment_logistics');
         Schema::table('order_shipment_logistics', function(Blueprint $table) {
             $table->dropForeign('LogisticaPedidoRastreio');
         });
         Schema::table('order_shipment_logistics', function(Blueprint $table) {
             $table->renameColumn('rastreio_id', 'order_shipment_id');
             $table->renameColumn('motivo', 'reason');
             $table->renameColumn('acao', 'action');
             $table->renameColumn('observacoes', 'note');
             $table->renameColumn('autorizacao', 'carrier_code');

             $table->foreign('order_shipment_id')
                 ->references('id')
                 ->on('order_shipments')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         /**
          * Order shipment issues
          */
         Schema::rename('pedido_rastreio_pis', 'order_shipment_issues');
         Schema::table('order_shipment_issues', function(Blueprint $table) {
             $table->dropForeign('PiPedidoRastreio');
         });
         Schema::table('order_shipment_issues', function(Blueprint $table) {
             $table->dropColumn('pago_cliente');

             $table->renameColumn('rastreio_id', 'order_shipment_id');
             $table->renameColumn('codigo_pi', 'carrier_code');
             $table->renameColumn('motivo_status', 'reason');
             $table->renameColumn('data_pagamento', 'payed_at');
             $table->renameColumn('valor_pago', 'payed_value');
             $table->renameColumn('acao', 'action');
             $table->renameColumn('observacoes', 'note');

             $table->foreign('order_shipment_id')
                 ->references('id')
                 ->on('order_shipments')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         /**
          * Order shipment monitor
          */
         Schema::rename('pedido_rastreio_monitorados', 'order_shipment_monitors');
         Schema::table('order_shipment_monitors', function(Blueprint $table) {
             $table->dropForeign('PedidoRastreioMonitoradosRastreio');
             $table->dropForeign('PedidoRastreioMonitoradosUsuario');
         });
         Schema::table('order_shipment_monitors', function(Blueprint $table) {
             $table->renameColumn('rastreio_id', 'order_shipment_id');
             $table->renameColumn('usuario_id', 'user_id');

             $table->foreign('order_shipment_id')
                 ->references('id')
                 ->on('order_shipments')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');

             $table->foreign('user_id')
                 ->references('id')
                 ->on('users')
                 ->onUpdate('CASCADE')
                 ->onDelete('CASCADE');
         });

         Schema::enableForeignKeyConstraints();
     }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
