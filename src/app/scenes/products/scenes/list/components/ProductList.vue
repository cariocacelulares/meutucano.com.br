<template>
  <App>
    <PageHeader>
      <div>
        <Dropdown placeholder="Linha de produtos"
          :itens="lines" name="productLines"/>
        <div class="separator">
          <VSeparator :spacing="20" :height="40" />
          <FeaturedValue label="Em estoque (144)"
          value="R$133.619,00" color="success" />
        </div>
      </div>

      <TButton size="big" color="success">
        <Icon name="plus" />
        &nbsp; Novo produto
      </TButton>
    </PageHeader>
    <ContentBox>
      <TableList :namespace="namespace" searchText="Pesquisar nos produtos">
        <thead slot="head">
          <tr>
            <th>SKU</th>
            <th>EAN</th>
            <th class="text-left">Produto</th>
            <th>Custo</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Estoque</th>
            <th></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="produto in products">
            <td>{{ produto.sku }}</td>
            <td>{{ produto.ean }}</td>
            <td class="text-left">{{ produto.titulo }}</td>
            <td>{{ produto.custo }}</td>
            <td>{{ produto.valor }}</td>
            <td>{{ produto.estado }}</td>
            <td>
              <Badge color="default" text="darker" v-if="produto.estoque.pendente">{{ produto.estoque.pendente }}</Badge>
              <Badge v-if="produto.estoque.pago">{{ produto.estoque.pago }}</Badge>
              {{ produto.estoque.disponivel }}
            </td>
            <td>
              <router-link :to="{ name: 'products.list' }">
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
  },

  data() {
    return {
      namespace: 'products/list'
    }
  },

  computed: {
    products() {
      return this.$store.getters[`${this.namespace}/GET`]
    },

    page() {
      return this.$store.getters['global/tableList/GET_PAGE']
    },

    lines() {
      return [
        {
          label: 'Item a',
          value: 1
        },
        {
          label: 'Item b',
          value: 2
        },
        {
          label: 'Item c',
          value: 3
        },
      ]
    }
  },

  mounted() {
    this.load()

    this.$root.$on('dropdownChanged.productLines', (item) => {
      // alguma ação pra quando troca a linha dos produtos
      console.log(item);
    })
  },

  beforeDestroy() {
    this.$root.$off('dropdownChanged.productLines')
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
