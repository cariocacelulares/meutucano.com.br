<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Migrations\Migration;

class AlterCustomerTablesToEnglish extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('allnation_products');
        Schema::dropIfExists('sugestoes');
        Schema::dropIfExists('meta_ano');
        Schema::dropIfExists('meta_mes');
        Schema::dropIfExists('gamification');
        Schema::dropIfExists('gamification_conquistas');
        Schema::dropIfExists('gamification_fila');
        Schema::dropIfExists('gamification_ranking');
        Schema::dropIfExists('gamification_recompensas');
        Schema::dropIfExists('gamification_solicitacoes');
        Schema::dropIfExists('gamification_tarefas');
        Schema::dropIfExists('gamification_trocas');
        Schema::dropIfExists('gamification_usuario_conquistas');
        Schema::dropIfExists('gamification_usuario_tarefas');
        Schema::dropIfExists('gamification_votos');
        Schema::dropIfExists('inspecao_tecnica');
        Schema::dropIfExists('inspecao_tecnica');
        Schema::dropIfExists('linha_atributos');
        Schema::dropIfExists('linha_atributo_opcoes');
        Schema::dropIfExists('produto_atributo');

        /**
         * Customers
         */
        Schema::rename('clientes', 'customers');
        Schema::table('customers', function(Blueprint $table) {
            $table->renameColumn('tipo', 'type');
            $table->renameColumn('nome', 'name');
            $table->renameColumn('fone', 'phone');
            $table->renameColumn('inscricao', 'document');
        });

        /**
         * Customer addresses
         */
        Schema::rename('cliente_enderecos', 'customer_addresses');
        Schema::table('customer_addresses', function(Blueprint $table) {
            $table->dropForeign('ClienteEnderecoCliente');
        });

        Schema::table('customer_addresses', function(Blueprint $table) {
            $table->renameColumn('cliente_id', 'customer_id');
            $table->renameColumn('cep', 'zipcode');
            $table->renameColumn('rua', 'street');
            $table->renameColumn('numero', 'number');
            $table->renameColumn('complemento', 'complement');
            $table->renameColumn('bairro', 'district');
            $table->renameColumn('cidade', 'city');
            $table->renameColumn('uf', 'state');

            $table->foreign('customer_id')
                ->references('id')
                ->on('customers')
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
