<template>
  <div class="content-wrapper">
    <form @submit.prevent="save">
      <Card :header-icon="newLine.id ? 'pencil' : 'plus'"
        :header-text="newLine.id ? 'Editar linha' : 'Cadastrar linha'">
        <TInput v-model="newLine.title" label="Título" :required="true"
          placeholder="Digite um título para a linha" :block="true" ref="lineInput"/>

        <div class="buttons">
          <span v-if="!newLine.id"></span>
          <TButton v-if="newLine.id" @click="cancel" left-icon="close"
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
          <tr v-for="line in lines">
            <td class="text-left text-bold">{{ line.title }}</td>
            <td>
              <a href="#" @click.prevent="edit(line)">
                <Icon name="pencil" text="Editar" color="link" />
              </a>
              <VSeparator :spacing="10" :height="10" />
              <a href="#" @click.prevent="destroy(line.id)">
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
      namespace: 'lines/list',
      newLine: {},
    }
  },

  methods: {
    fetch() {
      this.$store.dispatch('global/tableList/FETCH')
    },

    edit(line) {
      this.newLine = {
        id: line.id,
        title: line.title,
      }

      this.$refs.lineInput.$el.focus()
    },

    destroy(id) {
      axios.delete(`lines/${id}`).then((response) => {
        this.fetch()
        this.cancel()
      })
    },

    cancel() {
      this.newLine = {}
    },

    save() {
      if (typeof(this.newLine.id) != 'undefined' && this.newLine.id) {
        axios.put(`lines/${this.newLine.id}`, this.newLine).then((response) => {
          this.fetch()
          this.cancel()
        })
      } else {
        axios.post('lines', this.newLine).then((response) => {
          this.fetch()
          this.cancel()
        })
      }
    },
  },

  computed: {
    lines() {
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
