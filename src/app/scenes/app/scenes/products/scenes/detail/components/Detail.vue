<template>
  <div>
    <PageHeader :tabs="tabs">
        <div slot="left" class="left">
          <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
            <Icon name="angle-left" />
          </TButton>

          <TButton size="big" color="light" text="darker" :link="{ name: 'products.edit', params: { sku: product.sku } }">
            <Icon name="pencil" text="Editar" />
          </TButton>

          <TButton size="big" color="light" text="darker" :link="{ name: 'products.edit' }" class="m-l-10">
            <Icon name="files-o" text="Duplicar" />
          </TButton>

          <VSeparator :spacing="20" :height="40" />
          <FeaturedValue label="SKU" :value="product.sku" color="darker" />

          <VSeparator v-if="product.reference" :spacing="20" :height="40" />
          <FeaturedValue v-if="product.reference" label="Referência" :value="product.reference" color="darker" />
        </div>

        <TButton @click="activate" v-if="!product.active" size="big" color="success" leftIcon="check">Ativar</TButton>
        <TButton @click="deactivate" v-if="product.active" size="big" color="danger" leftIcon="close">Desativar</TButton>
      </PageHeader>

      <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tabs: [
        {
          text: 'Informações gerais',
          active: true,
          link: { name: 'products.detail.general' }
        },
        {
          text: 'Depósitos',
          label: 0,
          link: { name: 'products.detail.depots' }
        },
      ],
    }
  },

  computed: {
    product() {
      return this.$store.getters['products/detail/GET_PRODUCT']
    },
  },

  watch: {
    'product.depot_products_count'() {
      this.tabs[1].label = this.product.depot_products_count
    },
  },

  methods: {
    fetch() {
      this.$store.dispatch('products/detail/FETCH_PRODUCT', this.$route.params.sku)
    },

    activate() {
      axios.put(`products/${this.product.sku}/activate`).then((response) => {
        this.fetch()
      })
    },

    deactivate() {
      axios.put(`products/${this.product.sku}/deactivate`).then((response) => {
        this.fetch()
      })
    },

  },

  beforeMount() {
    this.fetch()
  },
}
</script>

<style lang="scss" scoped>
</style>
