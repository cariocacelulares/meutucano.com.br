<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue v-if="!creating" label="Nome do cliente" :value="user.name" color="darker" />

        <FeaturedValue v-else label="" value="Criar um novo cliente" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :boxed="true">
      <ValidationBox class="m-b-20" />
      <TInput v-model="user.name" label="Nome do cliente" placeholder="Nome completo" :block="true"/>

      <div class="grid-2 m-v-20">
        <TInput v-model="user.taxvat" label="Documento" placeholder="CPF/CNPJ"/>
        <TInput v-model="user.document" label="Inscrição estadual" placeholder="Vazio para isento"/>
      </div>

      <div class="grid-2">
        <TInput v-model="user.email" label="E-mail" placeholder="Melhor e-mail" type="email"/>
        <TInput v-model="user.phone" label="Telefone principal" placeholder="(99) 9 9999-9999"/>
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
</style>
