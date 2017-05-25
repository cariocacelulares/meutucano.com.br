<template>
  <div class="content-wrapper">
    <form @submit.prevent="save">
      <Card header-icon="plus" header-text="Formulário de marca">
        <TInput v-model="newBrand.title" label="Título" :required="true"
          placeholder="Digite um título para a marca" :block="true"/>

        <div class="buttons">
          <span v-if="!newBrand.id"></span>
          <TButton v-if="newBrand.id" @click="cancel" left-icon="close"
            color="default" text="darker">Cancelar</TButton>
          <TButton left-icon="check" color="success" type="submit">Salvar</TButton>
        </div>
      </Card>
    </form>

    <ContentBox>
      <TableList :namespace="namespace" input-width="105px">
        <thead slot="head">
          <tr>
            <th class="text-left">Nome</th>
            <th width="200"></th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-for="brand in brands">
            <td class="text-left text-bold">{{ brand.title }}</td>
            <td>
              <a href="#" @click.prevent="edit(brand)">
                <Icon name="pencil" text="Editar" color="link" />
              </a>
              <VSeparator :spacing="10" :height="10" />
              <a href="#" @click.prevent="destroy(brand.id)">
                <Icon name="close" text="Excluir" color="danger" />
              </a>
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
      namespace: 'brands/list',
      newBrand: {},
    }
  },

  methods: {
    fetch() {
      this.$store.dispatch('global/tableList/FETCH')
    },

    edit(brand) {
      this.newBrand = {
        id: brand.id,
        title: brand.title,
      }
    },

    destroy(id) {
      axios.delete(`brands/${id}`).then((response) => {
        this.fetch()
        this.cancel()
      })
    },

    cancel() {
      this.newBrand = {}
    },

    save() {
      if (typeof(this.newBrand.id) != 'undefined' && this.newBrand.id) {
        axios.put(`brands/${this.newBrand.id}`, this.newBrand).then((response) => {
          this.fetch()
          this.cancel()
        })
      } else {
        axios.post('brands', this.newBrand).then((response) => {
          this.fetch()
          this.cancel()
        })
      }
    },
  },

  computed: {
    brands() {
      return this.$store.getters[`${this.namespace}/GET`]
    },
  },
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;

  form {
    width: 30%;

    .buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
    }
  }

  .ContentBox {
    width: calc(70% - 20px);
    margin: 0;
  }
}
</style>
