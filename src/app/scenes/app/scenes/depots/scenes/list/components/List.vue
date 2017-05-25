<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <Dropdown placeholder="Deposito incluso?" v-model="filter" :options="options"/>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue :label="`Em estoque (${header.in_stock.quantity})`" :value="header.in_stock.total | money" color="success" />
      </div>

      <TButton size="big" color="success" :link="{ name: 'depots.create' }">
        <Icon name="plus" text="Novo depósito" />
      </TButton>
    </PageHeader>

    <ContentBox>
      <TableList :namespace="namespace">
        <thead slot="head">
          <tr>
            <th class="text-left">Título</th>
            <th width="150">Incluso</th>
            <th width="150">Prioridade</th>
            <th width="150">Estoque</th>
            <th width="150">Total</th>
            <th width="70"></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="depot in depots">
            <td class="text-left text-bold">{{ depot.title }}</td>
            <td>{{ depot.include ? 'Sim' : 'Não' }}</td>
            <td>{{ depot.priority }}</td>
            <td>{{ depot.quantity }}</td>
            <td>{{ depot.total }}</td>
            <td>
              <router-link :to="{ name: 'depots.detail', params: { slug: depot.slug } }">
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
      filter: {},
      namespace: 'depots/list',
      header: {
        in_stock: {
          quantity: 0,
          total: 0,
        }
      },

      options: [
        {
          text: 'Não',
          value: 0,
        },
        {
          text: 'Sim',
          value: 1,
        },
      ],
    }
  },

  computed: {
    depots() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  methods: {
    fetchHeader() {
      let filter = {
        filter: this.$store.getters[`${this.namespace}/GET_FILTER`]
      }

      filter = filter ? parseParams(filter) : ''

      axios.get(`depots/header${filter}`).then((response) => {
        this.header = response.data
      })
    },
  },

  watch: {
    filter() {
      this.$store.dispatch(`${this.namespace}/CHANGE_FILTER`, {
        include: this.filter.value
      })

      this.fetchHeader()
    },
  },

  beforeMount() {
    this.fetchHeader()
  },
}
</script>

<style lang="scss" scoped>
</style>
