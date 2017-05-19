<template>
  <div>
    <PageHeader :tabs="tabs">
          <div slot="left" class="left">
            <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
              <Icon name="angle-left" />
            </TButton>

            <TButton size="big" color="light" text="darker" :link="{ name: 'orders.edit', params: { id: order.id } }" class="m-r-10">
              <Icon name="pencil" text="Editar" />
            </TButton>

            <TButton size="big" color="light" text="darker" :link="{ name: 'orders.create' }">
              <Icon name="random" text="Nova variação" />
            </TButton>

            <VSeparator :spacing="20" :height="40" />
            <FeaturedValue :label="order.marketplace.title" :value="order.api_code || order.id" color="darker" />

            <VSeparator :spacing="20" :height="40" />
            <Badge type="label" :color="order.status_color">{{ order.status_cast }} <span v-if="order.refund">&nbsp;(Reembolso)</span></Badge>
            <FeaturedValue v-if="order.cancel_protocol" label="Protocolo" :value="order.cancel_protocol" color="darker" class="m-l-20" />
          </div>

          <div class="action-buttons">
            <TButton @click="prioritize" v-if="order.can_prioritize && !order.priority" size="big" color="info" leftIcon="arrow-up">Priorizar</TButton>
            <TButton @click="unprioritize" v-if="order.can_prioritize && order.priority" size="big" color="info" leftIcon="arrow-down">Despriorizar</TButton>
            <TButton @click="hold" v-if="order.can_hold && !order.holded" size="big" color="primary" leftIcon="hand-rock-o">Segurar</TButton>
            <TButton @click="unhold" v-if="order.can_hold && order.holded" size="big" color="primary" leftIcon="hand-paper-o">Liberar</TButton>
            <TButton @click="$confirm(approve)" v-if="order.can_aprove" size="big" color="success" leftIcon="check">Aprovar</TButton>
            <TButton @click="$confirm(destroy)" v-if="order.can_cancel" size="big" color="danger" type="submit" leftIcon="close">Cancelar</TButton>
          </div>
        </PageHeader>

        <router-view></router-view>
  </div>
</template>

<script>

export default {
  methods: {
    fetch() {
      this.$store.dispatch('orders/detail/FETCH_ORDER', this.$route.params.id)
    },

    destroy() {
      axios.put(`orders/cancel/${this.order.id}`).then((response) => {
        this.fetch()
      })
    },

    approve() {
      axios.put(`orders/approve/${this.order.id}`).then((response) => {
        this.fetch()
      })
    },

    prioritize() {
      axios.put(`orders/prioritize/${this.order.id}`).then((response) => {
        this.fetch()
      })
    },

    unprioritize() {
      axios.put(`orders/unprioritize/${this.order.id}`).then((response) => {
        this.fetch()
      })
    },

    hold() {
      axios.put(`orders/hold/${this.order.id}`).then((response) => {
        this.fetch()
      })
    },

    unhold() {
      axios.put(`orders/unhold/${this.order.id}`).then((response) => {
        this.fetch()
      })
    },

  },

  computed: {
    order() {
      return this.$store.getters['orders/detail/GET_ORDER']
    },
  },

  watch: {
    'order.comments_count'() {
      this.tabs[1].label = this.order.comments_count
    },

    'this.order.calls_count'() {
      this.tabs[2].label = this.this.order.calls_count
    },
  },

  data() {
    return {
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

  beforeMount() {
    this.fetch()
  },
}
</script>

<style lang="scss" scoped>
.action-buttons {
  .TButton {
    margin-left: 5px;
  }
}
</style>
