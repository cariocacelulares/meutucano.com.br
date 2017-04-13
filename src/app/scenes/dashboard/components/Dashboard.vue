<template>
  <App>
    <PageHeader>
    </PageHeader>
    <TContent>
    </TContent>
  </App>
</template>

<script>
import App from 'common/layout/App'
import PageHeader from 'common/layout/PageHeader'
import TContent from 'common/layout/TContent'
import { mapActions } from 'vuex';

export default {
  components: {
    App,
    PageHeader,
    TContent,
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
