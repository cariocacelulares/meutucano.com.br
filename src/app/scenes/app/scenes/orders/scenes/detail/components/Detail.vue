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
            <FeaturedValue :label="order.marketplace" :value="order.api_code" color="darker" />

            <VSeparator :spacing="20" :height="40" />
            <!-- <TLabel color="primary">Aprovado</TLabel> -->
            <TLabel color="danger">{{ order.status }} <span v-if="order.refund">&nbsp;(Reembolso)</span></TLabel>
            <FeaturedValue v-if="order.cancel_protocol" label="Protocolo" :value="order.cancel_protocol" color="darker" class="m-l-20" />
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
      order: {
        id: null,
        marketplace: null,
        api_code: null,
        status: null,
        refund: null,
        cancel_protocol: null,
      },
    }
  },

  mounted() {
    axios.get(`orders/${this.$route.params.id}`).then(
      (response) => {
        this.order = response.data
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
