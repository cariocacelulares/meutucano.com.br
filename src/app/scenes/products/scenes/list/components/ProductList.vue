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
      <TableList :data="tableData" :loading="loading.table"
        @search="search" searchText="Pesquisar nos produtos"
        @pageChanged="pageChanged">
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
          <tr v-for="produto in tableData">
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
      loading: {
        table: false,
        header: false
      },
      tableData: []
    }
  },

  computed: {
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
    this.load().then((response) => {
      this.tableData = response.data
    }).catch((error) => {
      console.log(error)
    })

    this.$root.$on('dropdownChanged.productLines', (item) => {
      // alguma ação pra quando troca a linha dos produtos
      console.log(item);
    })
  },

  beforeDestroy () {
    this.$root.$off('dropdownChanged.productLines')
  },

  methods: {
    search(term) {
      console.log('search', term);
    },

    pageChanged(page) {
      console.log('pageChanged', page);
    },

    load() {
      this.loading.table = true

      var promise = new Promise(resolve => {
        setTimeout(() => {
          this.loading.table = false

          let data = [
            {
              sku: 384,
              ean: 9182736098231,
              titulo: 'Telefone sem Fio Vtech LYRIX 550 DECT com Ramal',
              custo: 943.70,
              valor: 1999.90,
              estado: 'Novo',
              estoque: {
                pago: 2,
                pendente: 1,
                disponivel: 40
              },
            },
            {
              sku: 453,
              ean: 9185976398231,
              titulo: 'Alcatel Pixi4 Colors Azul',
              custo: 400.22,
              valor: 449.90,
              estado: 'Usado',
              estoque: {
                pago: 0,
                pendente: 5,
                disponivel: 200
              },
            },
          ]

          data = data.map((item) => {
            item.custo = formatter.format(item.custo)
            item.valor = formatter.format(item.valor)

            return item
          })

          data = data
            .concat(data)
            .concat(data)
            .concat(data)
            .concat(data)
            .concat(data)
            .concat(data)

          resolve({
            data: data
          })
        }, 1000)
      });

      return promise
    }
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
