<template>
  <div class="app">
    <THeader />

    <slot></slot>

    <TFooter />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import THeader from './header/THeader'
import TFooter from './TFooter'

export default {
  components: {
    THeader,
    TFooter,
  },

  computed: {
    ...mapGetters({
      authToken: 'global/GET_TOKEN',
    }),
  },

  methods: {
    ...mapActions({
      fetchUser: 'global/FETCH_USER'
    }),
  },

  beforeMount() {
    this.fetchUser()
  }
}
</script>

<style lang="scss">
@import '~style/vars';

.app {
  min-height: 100%;
  background-color: $ligther;
}
</style>
