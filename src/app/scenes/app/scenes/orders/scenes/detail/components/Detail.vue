<template>
  <div>
    <PageHeader :tabs="[
    {
      text: 'Informações gerais',
      active: true,
      link: { name: 'orders.detail.general' }
      },
      {
        text: 'Comentários',
        link: { name: 'orders.detail.comments' },
        label: 2,
        },
        {
          text: 'Ligações',
          link: { name: 'orders.detail.calls' },
          label: 1,
          },
          ]">
          <div slot="left" class="left">
            <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
              <Icon name="angle-left" />
            </TButton>

            <TButton size="big" color="light" text="darker" :link="{ name: 'orders.edit' }">
              <Icon name="random" text="Nova variação" />
            </TButton>

            <VSeparator :spacing="20" :height="40" />
            <FeaturedValue label="Mercado Livre" value="03-102973901" color="darker" />

            <VSeparator v-if="reference" :spacing="20" :height="40" />
            <!-- <TLabel color="primary">Aprovado</TLabel> -->
            <TLabel color="danger">Cancelado (Reembolso)</TLabel>
            <FeaturedValue label="Protocolo" value="123817189" color="darker" class="m-l-20" />
          </div>

          <div>
            <TButton size="big" color="success" type="submit" leftIcon="check">Aprovar</TButton>
            <TButton v-confirm="destroy" size="big" color="danger" type="submit" leftIcon="close" class="m-l-5">Excluir</TButton>
          </div>
        </PageHeader>

        <router-view></router-view>
  </div>
</template>

<script>

export default {
  methods: {
    destroy() {
      console.log('destroy it!')
    }
  },

  data() {
    return {
      sku: 1384,
      title: 'Motorola Moto G 2ª Geração XT1068 8GB Preto	',
      reference: 'CA1384',
    }
  },

  beforeRouteEnter(to, from, next) {
    // if (to.name == 'orders.create') {
      next()
    /*} else {
      axios.get('product/' + to.params.sku).then(
        (response) => {
          next()
        },
        (error) => {
          next({ name: 'orders.list' })
        }
      )
    }*/
  },
}
</script>

<style lang="scss" scoped>
</style>
