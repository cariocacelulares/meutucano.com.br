<template>
  <Modal name="Issue" icon="exclamation-triangle" title="Pedido de informação" :on-show="fetch" :on-confirm="save" :on-close="close">
    <form>
      <Alert icon="info" color="lightPrimary" text="darkPrimary">O rastreio assumirá o status de "Tratado" caso receber pagamento da PI.</Alert>

      <div class="grid-2 hgap-20">
        <InputGroup :input-shrink="1" :fix-label="true">
          <TInput label="Cód. da PI" placeholder="Digite o código da PI" slot="input" class="shrink-1" />
          <TButton size="big" color="info" slot="right">
            <Icon name="external-link" text="Abrir" />
          </TButton>
        </InputGroup>

        <TSelect label="Motivo" placeholder="Selecione o motivo" :block="true"
        :options="[{value: 1,text: 'Aqui'},{value: 2,text: 'Ali'},]"/>

        <TSelect label="Procedência" placeholder="Selecione a procedência" :block="true"
          :options="[{value: 1,text: 'Aqui'},{value: 2,text: 'Ali'},]"/>

        <InputGroup label="Data de pagamento">
          <Icon name="calendar" slot="left" />
          <TInput slot="input" placeholder="Selecione a data de pagamento" />
        </InputGroup>

        <InputGroup label="Valor pago">
          <Icon name="usd" slot="left" />
          <TInput slot="input" placeholder="Digite o valor pago pelo correios" />
        </InputGroup>

        <TSelect label="Ação realizada" placeholder="Selecione a ação realizada" :block="true"
        :options="[{value: 1,text: 'Aqui'},{value: 2,text: 'Ali'},]"/>
      </div>

      <TInput label="Protocolo de cancelamento" placeholder="Insira o protocolo de cancelamento" :block="true" />

      <TTextarea label="Observações" placeholder="Insira observações gerais relacionadas ao pedido de informação" :block="true" />
    </form>

    <template slot="right">
      <CommentsBox :order="id" :form="false" :only-important="true" />
    </template>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      id: null
    }
  },

  methods: {
    fetch() {
      this.id = this.$route.params.id
      console.log('depot fetch', this.id)
    },

    save() {
      console.log('depot save')
    },

    close() {
      this.id = null
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  > :not(:first-child) {
    margin-top: 20px;
  }
}
</style>
