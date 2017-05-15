<template>
  <Modal name="Devolution" icon="undo" title="Devolução" :on-show="fetch" :on-confirm="save" :on-close="close">
    <form>
      <Alert icon="info" color="lightPrimary" text="darkPrimary">O rastreio assumirá o status de "Devolvido" caso receber ação.</Alert>

      <TSelect label="Motivo" placeholder="Selecione o motivo" :block="true"
        :options="[{value: 1,text: 'Aqui'},{value: 2,text: 'Ali'},]"/>

      <TSelect label="Ação realizada" placeholder="Selecione a ação realizada" :block="true"
        :options="[{value: 1,text: 'Aqui'},{value: 2,text: 'Ali'},]"/>

      <TTextarea label="Observações" placeholder="Insira observações gerais relacionadas à devolução" :block="true" />
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
