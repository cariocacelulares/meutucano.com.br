<template>
  <form class="global-search" @submit.prevent="search">
    <Icon name="search" classes="m-r-10" color="dark" />

    <TInput type="search" v-model="term" placeholder="Busca global no tucano" :discrete="true" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      term: ''
    }
  },

  methods: {
    search() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.global-search {
  margin: 0 30px 0 20px;
  border-right: 1px solid $default;
  padding-right: 30px;
}
</style>
