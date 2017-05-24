<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue v-if="!creating" label="Nome do usuário" :value="user.name" color="darker" />

        <FeaturedValue v-else label="" value="Criar um novo usuário" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :boxed="true">
      <ValidationBox class="m-b-20" />

      <div class="grid-5">
        <TInput v-model="user.name" label="Nome do usuário" placeholder="Nome completo"/>
        <TInput v-model="user.email" label="E-mail" placeholder="E-mail profissional" type="email"/>
        <TInput v-model="user.role" label="Cargo" placeholder="Ex: Vendedor"/>
        <TInput v-model="user.password" label="Senha" placeholder="Senha secreta" type="password"/>
        <TSelect v-model="user.active" label="Status" placeholder="Selecione" :options="activeOpitons"/>
      </div>

      <div class="grid-4 m-t-20">
        <TCheckbox v-model="user.test" label="Administrador" color="black"/>
        <TCheckbox v-model="user.test" label="Gestor" color="black"/>
        <TCheckbox v-model="user.test" label="Atendimento" color="black"/>
        <TCheckbox v-model="user.test" label="Faturamento" color="black"/>
      </div>

      <div class="grid-4 role-descriptions m-b-20">
        <small>Acesso a todas as funcionalidades</small>
        <small>Acesso à valores e relatórios</small>
        <small>Acesso a pedidos, clientes e logística</small>
        <small>Acesso a faturamento e notas fiscais</small>
      </div>

      <h2>Permissões</h2>
      <HSeparator :top="0" :bottom="20" />

      <h3 class="m-t-0">Pedidos</h3>

      <div class="grid-6">
        <TCheckbox v-model="user.test" label="Visualizar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Criar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Alterar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Aprovar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Cancelar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Priorizar pedido" :bold="false"/>
      </div>

      <h3>Pedidos</h3>

      <div class="grid-6">
        <TCheckbox v-model="user.test" label="Visualizar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Criar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Alterar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Aprovar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Cancelar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Priorizar pedido" :bold="false"/>
      </div>

      <h3>Pedidos</h3>

      <div class="grid-6">
        <TCheckbox v-model="user.test" label="Visualizar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Criar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Alterar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Aprovar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Cancelar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Priorizar pedido" :bold="false"/>
      </div>

      <h3>Pedidos</h3>

      <div class="grid-6">
        <TCheckbox v-model="user.test" label="Visualizar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Criar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Alterar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Aprovar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Cancelar pedido" :bold="false"/>
        <TCheckbox v-model="user.test" label="Priorizar pedido" :bold="false"/>
      </div>
    </ContentBox>
  </form>
</template>

<script>
export default {
  props: {
    userId: {
      default: null
    }
  },

  data() {
    return {
      user: {},
      activeOpitons: [
        {
          text:'Ativo',
          value:1
        },
        {
          text:'Inativo',
          value:0
        },
      ]
    }
  },

  computed: {
    creating() {
      return (typeof(this.userId) != 'undefined' && this.userId) ? false : true
    },
  },

  methods: {
    save() {
      if (this.creating) {
        axios.post('users', this.user).then((response) => {
          this.$router.push({ name: 'users.detail', params: { id: response.data.id } })
          this.$toaster.success('Cliente criado com sucesso!')
        })
      } else {
        axios.put(`users/${this.user.id}`, this.user).then((response) => {
          this.$router.push({ name: 'users.detail', params: { id: response.data.id } })
          this.$toaster.success('Cliente alterado com sucesso!')
        })
      }
    },
  },

  beforeMount() {
    this.$store.dispatch('global/VALIDATION')


    if (typeof(this.$route.params.id) !== 'undefined') {
      axios.get(`users/${this.$route.params.id}`).then(
        (response) => {
          this.user = response.data
        },
        (error) => {
          this.$router.push({ name: 'users.list' })
        }
      )
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~style/vars';

.role-descriptions {
  margin-top: 5px;
  color: $dark;

  small {
    padding-left: 30px;
  }
}

h2, h3 {
  color: $darker;
  margin: 30px 0 15px 0;
}

h2 {
  font-size: 14px;
}

h3 {
  font-size: 12px;
}
</style>
