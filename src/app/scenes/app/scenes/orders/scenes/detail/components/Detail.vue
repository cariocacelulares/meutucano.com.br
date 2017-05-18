<template>
  <div>
    <PageHeader :tabs="tabs">
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
            <!-- <Badge type="label" color="primary">Aprovado</Badge> -->
            <Badge type="label" :color="order.status.color">{{ order.status.description }} <span v-if="order.refund">&nbsp;(Reembolso)</span></Badge>
            <FeaturedValue v-if="order.cancel_protocol" label="Protocolo" :value="order.cancel_protocol" color="darker" class="m-l-20" />
          </div>

          <div>
            <TButton size="big" color="success" type="submit" leftIcon="check">Aprovar</TButton>
            <TButton @click="$confirm(destroy)" size="big" color="danger" type="submit" leftIcon="close" class="m-l-5">Excluir</TButton>
          </div>
        </PageHeader>

        <router-view></router-view>
  </div>
</template>

<script>
import { default as OrderTransformer } from '../../../transformer'

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
    		status: {
          code: null,
          description: null,
          color: null,
        },
        refund: null,
        cancel_protocol: null,
      },
      tabs: [
        {
          text: 'Informações gerais',
          active: true,
          link: { name: 'orders.detail.general' }
        },
        {
          text: 'Comentários',
          link: { name: 'orders.detail.comments' },
          label: 0,
        },
        {
          text: 'Ligações',
          link: { name: 'orders.detail.calls' },
          label: 0,
        },
      ]
    }
  },

  mounted() {
    axios.get(`orders/${this.$route.params.id}`).then(
      (response) => {
        this.order = OrderTransformer.transform(response.data)

        this.tabs[1].label = this.order.comments_count
        this.tabs[2].label = this.order.calls_count
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
