<template>
  <Modal name="AddDepot" icon="plus" title="Adicionar depósito" :on-show="fetch" :on-confirm="save">
    <form>
      <TSelect label="Depósito" placeholder="Selecione o depósito" :block="true" :options="[
        {
          value: 1,
          text: 'Aqui'
        },
        {
          value: 2,
          text: 'Ali'
        },
      ]"/>
    </form>
  </Modal>
</template>

<script>
export default {
  methods: {
    fetch() {
      console.log('depot fetch')
    },

    save() {
      console.log('depot save')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
