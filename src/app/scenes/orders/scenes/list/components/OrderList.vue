<template>
  <App>
    <PageHeader>
      <div>
        <Dropdown placeholder="Período"
          :itens="periods" name="orderPeriods"/>
        <div class="separator">
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
      </div>

      <TButton size="big" color="success">
        <Icon name="plus" />
        &nbsp; Novo pedidos
      </TButton>
    </PageHeader>
    <ContentBox>
      <TableList :namespace="namespace" searchText="Pesquisar nos pedidos">
        <thead slot="head">
          <tr>
            <th>Código</th>
            <th>Canal</th>
            <th class="text-left">Cliente</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="order in orders">
            <td>{{ order.codigo_marketplace || order.id }}</td>
            <td>{{ order.marketplace }}</td>
            <td class="text-left">{{ order.cliente.nome }}</td>
            <td>{{ order.valor }}</td>
            <td>{{ order.data }}</td>
            <td>
              <TLabel :color="order.status.color" text="white">
                {{ order.status.description }}
              </TLabel>
            </td>
            <td>
              <router-link :to="{ name: 'orders.list' }">
                <Icon name="eye" />
              </router-link>
            </td>
          </tr>
        </tbody>
      </TableList>
    </ContentBox>
  </App>
</template>

<script>
import { App, PageHeader, ContentBox } from 'common/layout'
import {
  Dropdown,
  FeaturedValue,
  TButton,
  Icon,
  VSeparator,
  TableList,
  Badge,
  TLabel,
} from 'common/components'

export default {
  components: {
    App,
    PageHeader,
    ContentBox,
    Dropdown,
    FeaturedValue,
    TButton,
    Icon,
    VSeparator,
    TableList,
    Badge,
    TLabel,
  },

  data() {
    return {
      namespace: 'orders/list'
    }
  },

  computed: {
    orders() {
      return this.$store.getters[`${this.namespace}/GET`]
    },

    page() {
      return this.$store.getters['global/tableList/GET_PAGE']
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
    this.load()

    this.$root.$on('dropdownChanged.orderPeriods', (item) => {
      // alguma ação pra quando troca a linha dos pedidos
      console.log(item);
    })
  },

  beforeDestroy() {
    this.$root.$off('dropdownChanged.orderPeriods')
  },

  methods: {
    load() {
      return this.$store.dispatch(`${this.namespace}/FETCH`)
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~style/vars';

.page-header {
  .separator {
    display: flex;
    align-items: center;
  }
}
</style>
