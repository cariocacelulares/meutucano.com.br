<template>
  <App>
    <ContentBox>
      <h1>Bem vindo ao <code>MeuTucano</code>!</h1>
    </ContentBox>
  </App>
</template>

<script>
import App from 'common/layout/App'
import PageHeader from 'common/layout/PageHeader'
import ContentBox from 'common/layout/ContentBox'
import { mapActions } from 'vuex';

export default {
  components: {
    App,
    PageHeader,
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
