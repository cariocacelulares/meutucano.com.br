<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <MonthPicker v-model="filter" />

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue :label="`Cancelados (${header.canceled.quantity})`" :value="header.canceled.total | money" color="danger" />

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue :label="`Aprovados (${header.approved.quantity})`" :value="header.approved.total | money" color="success" />

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue :label="`Faturados (${header.invoiced.quantity})`" :value="header.invoiced.total | money" color="primary" />
      </div>

      <TButton size="big" color="success" :link="{ name: 'orders.create' }">
        <Icon name="plus" text="Novo pedido" />
      </TButton>
    </PageHeader>
    <ContentBox>
      <TableList :namespace="namespace">
        <thead slot="head">
          <tr>
            <th width="160">Código</th>
            <th width="160">Canal</th>
            <th class="text-left">Cliente</th>
            <th width="140">Valor</th>
            <th width="190">Data</th>
            <th width="150">Status</th>
            <th width="70"></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="order in orders">
            <td>{{ order.api_code || order.id }}</td>
            <td>{{ order.marketplace }}</td>
            <td class="text-left text-bold">{{ order.customer.name }}</td>
            <td>{{ order.total | money }}</td>
            <td>{{ order.created_at | dateTime }}</td>
            <td>
              <Badge type="label" :color="order.status_color" text="white">
                {{ order.status_cast }}
              </Badge>
            </td>
            <td>
              <router-link :to="{ name: 'orders.detail', params: { id: order.id } }">
                <Icon name="eye" />
              </router-link>
            </td>
          </tr>
        </tbody>
      </TableList>
    </ContentBox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header: {
        canceled: {
          quantity: 0,
          total: 0,
        },
        approved: {
          quantity: 0,
          total: 0,
        },
        invoiced: {
          quantity: 0,
          total: 0,
        },
      },
      namespace: 'orders/list',
      filter: null,
    }
  },

  watch: {
    filter() {
      this.$store.dispatch(`${this.namespace}/CHANGE_FILTER`, {
        month: this.filter.month,
        year: this.filter.year,
      })

      this.fetchHeader()
    }
  },

  computed: {
    orders() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  methods: {
    fetchHeader() {
      const filter = {
        filter: {
          month: this.filter.month,
          year: this.filter.year,
        }
      }

      if (filter) {
        axios.get('orders/header' + parseParams(filter)).then((response) => {
          this.header = response.data
        })
      }
    },
  },

  beforeMount() {
    this.fetchHeader()
  },
};
</script>

<style lang="scss" scoped>
.MonthPicker {
  width: 212px;
}
</style>
