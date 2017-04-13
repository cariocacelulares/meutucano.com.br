<template>
  <form class="global-search" @submit.prevent="search">
    <Icon name="search" class="m-r-15" />

    <TInput type="search" v-model="term" placeholder="Busca global no tucano"/>
  </form>
</template>

<script>
import TInput from 'common/components/TInput'
import Icon from 'common/components/Icon'

export default {
  components: {
    TInput,
    Icon,
  },

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

.TInput {
  width: 138px;
  font-size: 13px;
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 0;
  background-color: transparent;

  &:hover,
  &:focus {
    background-color: transparent;
  }
}

.global-search {
  margin: 0 30px 0 20px;
  border-right: 1px solid $default;
  padding-right: 30px;
}
</style>
