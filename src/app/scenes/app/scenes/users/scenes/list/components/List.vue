<template>
  <div>
    <PageHeader>
      <div slot="left" class="left">
        <Dropdown placeholder="Status do usuário" v-model="filter" :options="options"/>
      </div>

      <TButton size="big" color="success" :link="{ name: 'users.create' }">
        <Icon name="plus" text="Novo usuário" />
      </TButton>
    </PageHeader>

    <ContentBox>
      <TableList :namespace="namespace">
        <thead slot="head">
          <tr>
            <th width="32"></th>
            <th class="text-left">Nome</th>
            <th width="300">E-mail</th>
            <th width="200">Cargo</th>
            <th width="100">Ativo</th>
            <th width="70"></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="user in users">
            <td>
              <Avatar :src="user.avatar" :alt="user.name" />
            </td>
            <td class="text-left text-bold">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td><ActiveBadge :active="user.active" /></td>
            <td>
              <router-link :to="{ name: 'users.edit', params: { id: user.id } }">
                <Icon name="pencil" size="big" />
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
      namespace: 'users/list',

      options: [
        {
          text: 'Ativo',
          value: 1,
        },
        {
          text: 'Inativo',
          value: 0,
        },
      ],
    }
  },

  computed: {
    users() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },

  watch: {
    filter() {
      this.$store.dispatch(`${this.namespace}/CHANGE_FILTER`, {
        active: this.filter.value
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
