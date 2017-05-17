<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <Dropdown placeholder="Período"
        :itens="periods" name="orderPeriods"/>
        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="Cancelados (144)"
        value="R$8.125,00" color="danger" />
        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="Aprovados (14)"
        value="R$3.619,00" color="success" />
        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="Faturados (89)"
        value="R$53.923,00" color="primary" />
      </div>

      <TButton size="big" color="success">
        <Icon name="plus" text="Novo pedidos" />
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
              <TLabel :color="order.status.color" text="white">
                {{ order.status.description }}
              </TLabel>
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
      namespace: 'orders/list'
    }
  },

  computed: {
    orders() {
      return this.$store.getters[`${this.namespace}/GET`]
    },

    periods() {
      return [
        {
          label: 'Abril/2017',
          value: 1
        },
        {
          label: 'Março/2017',
          value: 2
        },
        {
          label: 'Fevereiro/2017',
          value: 3
        },
      ]
    }
  },

  mounted() {
    this.$root.$on('dropdownChanged.orderPeriods', (item) => {
      // alguma ação pra quando troca a linha dos pedidos
      console.log(item);
    })
  },

  beforeDestroy() {
    this.$root.$off('dropdownChanged.orderPeriods')
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
