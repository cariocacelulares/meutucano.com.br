<template>
  <Modal icon="plus" title="Adicionar depósito" :on-close="close" :on-show="fetch" :on-confirm="save" :id="_uid">
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
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },

  watch: {
    show() {
      if (this.show) {
        this.$root.$emit('show::modal', this._uid)
      }
    }
  },

  methods: {
    fetch() {
      console.log('depot fetch')
    },

    save() {
      console.log('depot save')
    },

    close() {
      console.log('depot close')
      this.$emit('closed')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
