<template>
  <form @submit.prevent="save">
    <PageHeader>
      <div slot="left" class="left">
        <TButton size="big" color="light" text="dark" :back="true">
          <Icon name="angle-left" />
        </TButton>

        <VSeparator :spacing="20" :height="40" />

        <FeaturedValue v-if="!creating" label="Depósito" :value="depot.title" color="darker" />

        <FeaturedValue v-else label="" value="Criar um novo depósito" color="darker" />
      </div>

      <TButton size="big" color="success" type="submit">
        <Icon name="check" text="Salvar" />
      </TButton>
    </PageHeader>

    <ContentBox :boxed="true">
      <ValidationBox class="m-b-20" />

      <div class="grid-3">
        <TInput v-model="depot.title" label="Nome do depósito" placeholder="Ex: galpão 2" class="span-2"/>
        <TSelect v-model="depot.include" label="Incluir na contagem principal" placeholder="Selecione" :options="options"/>
      </div>

      <div class="m-t-20">
        <div>
          <TInput v-model="depot.priority" label="Ordem de alocação" placeholder="0 = primeiro depósito" :min="0" type="number"/>
          <Help title="Define a ordem que os estoques são alocados conforme o sistema recebe pedidos. "/>
        </div>
      </div>
    </ContentBox>
  </form>
</template>

<script>
export default {
  props: {
    depotSlug: {
      default: null,
    }
  },

  data() {
    return {
      depot: {},
      options: [
        {
          text: 'Não',
          value: 0,
        },
        {
          text: 'Sim',
          value: 1,
        },
      ]
    }
  },

  computed: {
    creating() {
      return (typeof(this.depotSlug) != 'undefined' && this.depotSlug) ? false : true
    },
  },

  methods: {
    save() {
      if (this.creating) {
        axios.post('depots', this.depot).then((response) => {
          this.$router.push({ name: 'depots.detail', params: { slug: response.data.slug } })
          this.$toaster.success('Depósito criado com sucesso!')
        })
      } else {
        axios.put(`depots/${this.depot.slug}`, this.depot).then((response) => {
          this.$router.push({ name: 'depots.detail', params: { slug: response.data.slug } })
          this.$toaster.success('Depósito alterado com sucesso!')
        })
      }
    },
  },

  beforeMount() {
    this.$store.dispatch('global/VALIDATION')


    if (typeof(this.$route.params.slug) !== 'undefined') {
      axios.get(`depots/${this.$route.params.slug}`).then(
        (response) => {
          this.depot = response.data
        },
        (error) => {
          this.$router.push({ name: 'depots.list' })
        }
      )
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
