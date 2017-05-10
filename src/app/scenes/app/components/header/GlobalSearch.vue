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
  position: relative;
  margin-left: 20px;
  padding-right: 61px;

  &:after {
      content: '';
    position: absolute;
    top: 5px;
    right: 30px;
    width: 1px;
    height: 30px;
    background-color: $light;
  }
}
</style>
