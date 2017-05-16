<template>
  <div>
    <PageHeader :tabs="tabs">
        <div slot="left" class="left">
          <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
            <Icon name="angle-left" />
          </TButton>

          <TButton size="big" color="light" text="darker" :link="{ name: 'products.edit' }">
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

        <TButton size="big" color="danger" type="submit" leftIcon="close">Excluir</TButton>
      </PageHeader>

      <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      product: {
        sku: null,
        brand_id: null,
        line_id: null,
        title: null,
        ean: null,
        ncm: null,
        price: null,
        cost: null,
        condition: null,
        warranty: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
        reserved_stock: null,
      },
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

  mounted() {
    axios.get(`products/${this.$route.params.sku}`).then(
      (response) => {
        this.product = response.data

        this.tabs[1].label = this.product.depot_products_count
      },
      (error) => {
        console.log(error)
      }
    )
  },
}
</script>

<style lang="scss" scoped>
</style>
