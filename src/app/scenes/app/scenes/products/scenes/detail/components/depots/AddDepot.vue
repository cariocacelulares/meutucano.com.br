<template>
  <Modal name="AddDepot" icon="plus" title="Adicionar depósito" :on-show="fetch" :on-confirm="save">
    <form>
      <TSelect label="Depósito" placeholder="Selecione o depósito" v-model="depot"
        :block="true" :options="depots"/>
    </form>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      depot: null,
      depots: [],
    }
  },

  methods: {
    fetch() {
      axios.get(`depots/from/product/${this.$route.params.sku}/available`).then(
        (response) => {
          this.depots = response.data.map((item) => {
            return {
              value: item.slug,
              text: item.title
            }
          })
        },
        (error) => {
          console.log(error)
        }
      )
    },

    save() {
      axios.post('depots/products', {
      	"product_sku": 384,
      	"depot_slug": this.depot
      }).then(
        (response) => {
          console.log(response)
        },
        (error) => {
          console.log(error)
        }
      )

      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
}
</style>
