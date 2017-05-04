<template>
  <div class="app">
    <THeader />
    <TopBar />

    <slot></slot>

    <TFooter />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import THeader from './THeader'
import TopBar from './TopBar'
import TFooter from './TFooter'

export default {
  components: {
    THeader,
    TopBar,
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

<style lang="scss" scoped>
@import '~style/vars';

.app {
  min-height: 100%;
  background-color: $lighter;
}
</style>
