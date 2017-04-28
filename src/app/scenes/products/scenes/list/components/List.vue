<template>
  <App>
    <PageHeader>
      <div slot="left" class="left">
        <Dropdown placeholder="Linha de produtos"
          :itens="lines" name="productLines"/>
        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="Em estoque (144)"
          value="R$133.619,00" color="success" />
      </div>

      <TButton size="big" color="success" :link="{ name: 'products.create' }">
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
          <tr v-for="product in products">
            <td>{{ product.sku }}</td>
            <td>{{ product.ean }}</td>
            <td class="text-left text-bold">{{ product.titulo }}</td>
            <td>{{ product.cost }}</td>
            <td>{{ product.valor }}</td>
            <td>{{ product.estado }}</td>
            <td>
              <Badge color="default" text="darker" v-if="product.estoque.pendente">{{ product.estoque.pendente }}</Badge>
              <Badge v-if="product.estoque.pago">{{ product.estoque.pago }}</Badge>
              {{ product.estoque.disponivel }}
            </td>
            <td>
              <router-link :to="{ name: 'products.list' }">
                <Icon name="eye" size="big" />
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
    this.$root.$on('dropdownChanged.productLines', (item) => {
      // alguma ação pra quando troca a linha dos products
      console.log(item);
    })
  },

  beforeDestroy() {
    this.$root.$off('dropdownChanged.productLines')
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
