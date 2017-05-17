<template>
  <ContentBox>
    <h1>Bem vindo ao <code>MeuTucano</code>!</h1>
    <br>
    <br>
    <br>
    <v-select theme="tucano"
      :on-search="getOptions"
      :options="options"
      placeholder="Search GitHub Repositories...">
      <template slot="no-options">Nada foi encontrado</template>
    </v-select>
  </ContentBox>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {label: 'teste',value: 1},
        {label: 'aaaaaaaa',value: 2},
      ],
    }
  },

  methods: {
    getOptions(search, loading) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(function() {
        loading(true)

        axios.get('lines/fetch' + parseParams({ search })).then(
          (response) => {

            this.debounce = setTimeout(function() {
            this.options = []

            response.data.forEach((item) => {
              this.options.push({
                label: item.title,
                value: item.id
              })
            })

            loading(false)
            }.bind(this), 2000)
          }
        )
      }.bind(this), 500)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
