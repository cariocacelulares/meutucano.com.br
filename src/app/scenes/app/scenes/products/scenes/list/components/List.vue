<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <v-select theme="gray" :inside-search="true"
          :on-search="getOptions"
          :options="options"
          :on-change="filterChanged"
          placeholder="Linha de produtos"
          search-placeholder="Faça uma busca">
          <template slot="no-options">Nada foi encontrado</template>
        </v-select>

        <VSeparator :spacing="20" :height="40" />
        <FeaturedValue label="Em estoque (144)"
        value="R$133.619,00" color="success" />
      </div>

      <TButton size="big" color="success" :link="{ name: 'products.create' }">
        <Icon name="plus" text="Novo produto" />
      </TButton>
    </PageHeader>

    <ContentBox>
      <TableList :namespace="namespace">
        <thead slot="head">
          <tr>
            <th width="100">SKU</th>
            <th width="170">EAN</th>
            <th class="text-left">Produto</th>
            <th width="150">Custo</th>
            <th width="150">Valor</th>
            <th width="100">Estado</th>
            <th width="100">Estoque</th>
            <th width="70"></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="product in products">
            <td>{{ product.sku }}</td>
            <td>{{ product.ean || 'N/A' }}</td>
            <td class="text-left text-bold">{{ product.title }}</td>
            <td>{{ product.cost | money }}</td>
            <td>{{ product.price | money }}</td>
            <td>{{ product.condition_cast }}</td>
            <td>
              <!-- <Badge color="default" text="darker" v-if="product.estoque.pendente">{{ product.estoque.pendente }}</Badge> -->
              <Badge v-if="product.reserved_stock">{{ product.reserved_stock }}</Badge>
              {{ product.available_stock }}
            </td>
            <td>
              <router-link :to="{ name: 'products.detail', params: { sku: product.sku } }">
                <Icon name="eye" size="big" />
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
      options: [],
      debounce: null,
      namespace: 'products/list',
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
    /*this.$root.$on('dropdownChanged.productLines', (item) => {
      // alguma ação pra quando troca a linha dos products
      console.log(item)
    })*/
  },

  beforeDestroy() {
    // this.$root.$off('dropdownChanged.productLines')
  },

  methods: {
    filterChanged(filter) {
      this.$store.dispatch(`${this.namespace}/CHANGE_FILTER`, {
        line_id: filter.value
      })
    },

    getOptions(search, loading) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        loading(true)

        axios.get('lines/fetch' + parseParams({ search })).then(
          (response) => {
            this.options = []

            response.data.forEach((item) => {
              this.options.push({
                label: item.title,
                value: item.id
              })
            })

            loading(false)
          }
        )
      }.bind(this), 500)
    },
  },
};
</script>

<style lang="scss" scoped>
.v-select {
  width: 230px;
}
</style>
