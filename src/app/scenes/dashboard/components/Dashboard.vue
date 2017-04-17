<template>
  <App>
    <ContentBox>
      <h1>Bem vindo ao <code>MeuTucano</code>!</h1>
    </ContentBox>
  </App>
</template>

<script>
import { mapActions } from 'vuex';
import {
  App,
  ContentBox
} from 'common/layout/'

export default {
  components: {
    App,
    ContentBox,
  },

  data() {
    return {
      //
    };
  },

  methods: {
    ...mapActions({
      //
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
