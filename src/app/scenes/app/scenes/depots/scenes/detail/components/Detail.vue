<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true" class="m-r-10">
          <Icon name="angle-left" />
        </TButton>

        <TButton size="big" color="light" text="darker" :link="{ name: 'depots.edit', params: { sku: depot.sku } }">
          <Icon name="pencil" text="Editar" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <div class="header-details">
          <FeaturedValue label="Depósito" :value="depot.title" color="darker" />
          <FeaturedValue label="Incluir para venda" :value="depot.include ? 'Sim' : 'Não'" color="darker" />
          <FeaturedValue label="Ordem de saída" :value="depot.priority" color="darker" />
          <FeaturedValue label="Quantidade" :value="depot.quantity" color="darker" />
          <FeaturedValue label="Total" :value="depot.total" color="darker" />
        </div>

      </div>

      <TButton @click="$confirm(destroy, depot.slug)" color="danger" text="white" leftIcon="close">Excluir</TButton>
    </PageHeader>

    <ContentBox>
      <TableList :namespace="namespace">
        <thead slot="head">
          <tr>
            <th width="150">SKU</th>
            <th class="text-left">Produto</th>
            <th width="150">Quantidade</th>
            <th width="150">Total</th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="depotProduct in depotProducts">
            <td>{{ depotProduct.product_sku }}</td>
            <td class="text-left text-bold">{{ depotProduct.product.title }}</td>
            <td>{{ depotProduct.quantity }}</td>
            <td>{{ depotProduct.total }}</td>
          </tr>
        </tbody>
      </TableList>
    </ContentBox>
  </div>
</template>

<script>
import { default as DepotTransformer } from '../../../transformer'

export default {
  props: {
    depotSlug: {
      default: null
    }
  },

  data() {
    return {
      namespace: 'depots/detail/products',
      depot: {},
      loading: true,
    }
  },

  computed: {
    depotProducts() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  methods: {
    destroy(slug) {
      axios.delete(`depots/${slug}`).then((response) => {
        this.$parent.$forceUpdate()
        this.$router.push({ name: 'depots' })
      })
    },

    fetch() {
      axios.get(`depots/${this.depotSlug}`).then((response) => {
        this.depot = DepotTransformer.transform(response.data)
        this.loading = false
      })
    },
  },

  beforeMount() {
    this.fetch()

    this.$store.dispatch(`${this.namespace}/SET_DEPOT`, this.depotSlug)
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.header-details {
  display: flex;
  align-items: center;

  .FeaturedValue:not(:first-child) {
    margin-left: 50px;
  }
}
</style>
