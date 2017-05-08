<template>
  <App>
    <PageHeader :tabs="[
      {
        text: 'Informações gerais',
        active: true,
        link: { name: 'products.detail.general' }
      },
      {
        text: 'Depósitos',
        label: 3,
        link: { name: 'products.detail.depots' }
      },
    ]">
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
        <FeaturedValue label="SKU" :value="sku" color="darker" />

        <VSeparator v-if="reference" :spacing="20" :height="40" />
        <FeaturedValue v-if="reference" label="Referência" :value="reference" color="darker" />
      </div>

      <TButton size="big" color="danger" type="submit" leftIcon="close">Excluir</TButton>
    </PageHeader>

    <router-view></router-view>
  </App>
</template>

<script>

export default {
  data() {
    return {
      sku: 1384,
      title: 'Motorola Moto G 2ª Geração XT1068 8GB Preto	',
      reference: 'CA1384',
    }
  },

  computed() {
  },

  beforeRouteEnter(to, from, next) {
    // if (to.name == 'products.create') {
      next()
    /*} else {
      axios.get('product/' + to.params.sku).then(
        (response) => {
          next()
        },
        (error) => {
          next({ name: 'products.list' })
        }
      )
    }*/
  },
}
</script>

<style lang="scss" scoped>
</style>
