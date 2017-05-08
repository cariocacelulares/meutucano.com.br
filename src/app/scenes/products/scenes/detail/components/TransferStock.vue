<template>
  <Modal name="TransferStock" icon="exchange" title="Transferir estoque" :on-show="fetch" :on-confirm="save">
    <form @submit.prevent>
      <TSelect class="m-b-20" label="Depósito de destino" placeholder="Selecione o depósito" :block="true" :options="[
        {
          value: 1,
          text: 'Aqui'
        },
        {
          value: 2,
          text: 'Ali'
        },
      ]"/>

      <SerialBox label="Seriais" :serials="serials" @add="validate" />
    </form>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      valid: 0,
      serials: []
    }
  },

  mounted() {
    setTimeout(() => {
      this.serials = [
        {
          serial: '1554545645645',
          valid: true,
          message: null,
          product: {
            title: 'Samsung Galaxy S5 Preto 15GB',
            depot: {
              name: 'Estoque físico'
            },
          },
        },
        {
          serial: 'DAS5445645645',
          valid: false,
          message: 'Serial não registrado',
          product: {
            title: 'Samsung Galaxy S5 Preto 15GB',
            depot: {
              name: 'Estoque físico'
            },
          },
        },
      ]
    }, 1000)
  },

  methods: {
    fetch() {
      console.log('transfer fetch')
    },

    save() {
      console.log('transfer save')
    },

    validate(index) {
      setTimeout(() => {
        this.serials[index].valid = true
      }, 500)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
