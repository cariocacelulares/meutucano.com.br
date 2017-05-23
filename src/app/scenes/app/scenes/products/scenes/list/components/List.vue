<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <v-select theme="gray" :inside-search="true"
          :on-search="getOptions"
          :options="options"
          :on-change="filterChanged"
          placeholder="Linha de produtos"
          search-placeholder="Buscar linha">
          <template slot="no-options">Nada foi encontrado</template>
        </v-select>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue :label="`Em estoque (${header.in_stock.quantity})`" :value="header.in_stock.total | money" color="success" />
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
            <th width="100">Ativo</th>
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
              <Badge v-if="product.active" :circular="true" color="success"><Icon name="check" /></Badge>
              <Badge v-if="!product.active" :circular="true" color="danger"><Icon name="close" /></Badge>
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
      header: {
        in_stock: {
          quantity: 0,
          total: 0,
        }
      },
      options: [],
      debounce: null,
      namespace: 'products/list',
    }
  },

  computed: {
    products() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  methods: {
    fetchHeader() {
      let filter = {
        filter: this.$store.getters[`${this.namespace}/GET_FILTER`]
      }

      filter = filter ? parseParams(filter) : ''

      axios.get(`products/header${filter}`).then((response) => {
        this.header = response.data
      })
    },

    filterChanged(filter) {
      this.$store.dispatch(`${this.namespace}/CHANGE_FILTER`, {
        line_id: filter.value
      })

      this.fetchHeader()
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

  beforeMount() {
    this.fetchHeader()
  },
}
</script>

<style lang="scss" scoped>
.v-select {
  width: 230px;
}
</style>
