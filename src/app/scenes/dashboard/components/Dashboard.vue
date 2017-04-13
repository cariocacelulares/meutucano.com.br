<template>
  <div class="dashboard">
    <h1>Bem vindo ao meu tucano :D</h1>
    <TButon @buttonClicked="signOut" type="button" color="danger" size="big">
      Sair
    </TButon>
  </div>
</template>

<script>
import * as types from '../vuex/types'
import { mapActions, mapGetters } from 'vuex';
import TButon from 'common/components/TButon';

export default {
  components: {
    TButon,
  },

  data() {
    return {
      //
    };
  },

  computed: {
    ...mapGetters({
      authToken: 'global/GET_TOKEN',
    }),
  },

  methods: {
    ...mapActions({
      logout: 'global/SIGN_OUT',
      fetchUser: 'global/FETCH_USER'
    }),

    signOut() {
      this.logout()
      this.$router.push({ name: 'auth.signin' })
    }
  },

  mounted() {
    this.$root.$on('buttonClicked', () => this.signOut())
  },

  beforeMount() {
    this.fetchUser()
  }
};
</script>

<style lang="scss" scoped>
</style>
