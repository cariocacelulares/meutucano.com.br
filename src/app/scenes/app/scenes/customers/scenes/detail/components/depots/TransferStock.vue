<template>
  <Modal name="TransferStock" icon="exchange" title="Transferir estoque" :on-show="fetch" :on-confirm="save" :on-close="onClose">
    <form @submit.prevent>
      <TSelect class="m-b-20" label="Depósito de destino" placeholder="Selecione o depósito"
        :block="true" :options="depots" v-model="depot"/>

      <SerialBox label="Seriais" :serials="serials" @add="validate" :disabled="!depot" />
    </form>
  </Modal>
</template>

<script>
export default {
  props: {
    from: {
      type: String | Number,
      required: true,
    }
  },

  data() {
    return {
      depot: null,
      depots: [],
      serials: []
    }
  },

  computed: {
    id() {
      return this.$route.params.id
    },

    sku() {
      return this.$route.params.sku
    },
  },

  methods: {
    onClose() {
      this.depot = null
      this.depots = []
      this.serials = []
    },

    fetch() {
      axios.get(`depots/transferable/${this.id}`).then((response) => {
        this.depots = response.data

        this.depots = this.depots.map((item) => {
          return {
            value: item.slug,
            text: item.title,
          }
        })
      })
    },

    save() {
      const invalid = this.serials.reduce((previous, current) => {
        return (current.valid) ? previous : (previous + 1);
      }, 0)

      if (invalid > 0) {
        this.$toaster.warning('Não foi possível fazer a transferência!', 'Existem seriais inválidos.')

        return false;
      }

      axios.post('products/serials/transfer', {
        depot_from: this.from,
        depot_to: this.depot,
        serials: this.serials.map((item) => {
          return item.serial
        }),
      }).then((response) => {
        this.$emit('close')
      })
    },

    validate(index) {
      axios.get('products/serials/check' + parseParams({
        depot_from: this.from,
        product_sku: this.sku,
        serials: this.serials[index].serial
      })).then((response) => {
        this.serials[index].valid = response.data.available
        this.serials[index].message = response.data.message
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
