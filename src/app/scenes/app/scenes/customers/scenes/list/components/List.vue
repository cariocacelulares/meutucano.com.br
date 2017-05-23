<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <Dropdown placeholder="Tipo de cliente" v-model="filter" :options="options"/>
      </div>

      <TButton size="big" color="success" :link="{ name: 'customers.create' }">
        <Icon name="plus" text="Novo cliente" />
      </TButton>
    </PageHeader>

    <ContentBox>
      <TableList :namespace="namespace">
        <thead slot="head">
          <tr>
            <th width="170">Documento</th>
            <th class="text-left">Cliente</th>
            <th width="170">Telefone</th>
            <th width="250">E-mail</th>
            <th width="70"></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="customer in customers">
            <td>{{ customer.taxvat | taxvat }}</td>
            <td class="text-left text-bold">{{ customer.name }}</td>
            <td>{{ customer.phone | phone }}</td>
            <td>{{ customer.email || '-' }}</td>
            <td>
              <router-link :to="{ name: 'products.detail', params: { sku: customer.id } }">
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
      namespace: 'customers/list',

      options: [
        {
          text: 'Pessoa física',
          value: 0,
        },
        {
          text: 'Pessoa jurídica',
          value: 1,
        },
      ],
    }
  },

  computed: {
    customers() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  watch: {
    filter() {
      this.$store.dispatch(`${this.namespace}/CHANGE_FILTER`, {
        type: this.filter.value
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.v-select {
  width: 230px;
}
</style>
