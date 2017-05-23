<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue v-if="!creating" label="Nome do cliente" :value="customer.name" color="darker" />

        <FeaturedValue v-else label="" value="Criar um novo cliente" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :boxed="true">
      <ValidationBox class="m-b-20" />
      <TInput v-model="customer.name" label="Nome do cliente" placeholder="Nome completo" :block="true"/>

      <div class="grid-2 m-v-20">
        <TInput v-model="customer.taxvat" label="Documento" placeholder="CPF/CNPJ"/>
        <TInput v-model="customer.document" label="Inscrição estadual" placeholder="Vazio para isento"/>
      </div>

      <div class="grid-2">
        <TInput v-model="customer.email" label="E-mail" placeholder="Melhor e-mail" type="email"/>
        <TInput v-model="customer.phone" label="Telefone principal" placeholder="(99) 9 9999-9999"/>
      </div>
    </ContentBox>
  </form>
</template>

<script>
export default {
  props: {
    customerId: {
      default: null
    }
  },

  data() {
    return {
      customer: {},
    }
  },

  computed: {
    creating() {
      return (typeof(this.customerId) != 'undefined' && this.customerId) ? false : true
    },
  },

  methods: {
    save() {
      if (this.creating) {
        axios.post('customers', this.customer).then((response) => {
          this.$router.push({ name: 'customers.detail', params: { id: response.data.id } })
          this.$toaster.success('Cliente criado com sucesso!')
        })
      } else {
        axios.put(`customers/${this.customer.id}`, this.customer).then((response) => {
          this.$router.push({ name: 'customers.detail', params: { id: response.data.id } })
          this.$toaster.success('Cliente alterado com sucesso!')
        })
      }
    },
  },

  beforeMount() {
    this.$store.dispatch('global/VALIDATION')


    if (typeof(this.$route.params.id) !== 'undefined') {
      axios.get(`customers/${this.$route.params.id}`).then(
        (response) => {
          this.customer = response.data
        },
        (error) => {
          this.$router.push({ name: 'customers.list' })
        }
      )
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
