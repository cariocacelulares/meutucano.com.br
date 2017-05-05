<template>
  <Modal icon="trash" title="Bosta" :on-close="close" :id="_uid">
    <h1>cala essa boca de merda</h1>
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
    close() {
      console.log('depot close')
      this.$emit('closed')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
