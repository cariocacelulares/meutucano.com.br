<template>
  <Modal name="TransferStock" icon="exchange" title="Transferir estoque" :on-show="fetch" :on-confirm="save">
    <form>
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

      <SerialBox label="Seriais" :serials="serials" @remove="removeSerial" />
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
        },
        {
          serial: 'DAS5445645645',
          valid: false,
          message: 'Serial não registrado',
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

    removeSerial(index) {
      this.serials.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
