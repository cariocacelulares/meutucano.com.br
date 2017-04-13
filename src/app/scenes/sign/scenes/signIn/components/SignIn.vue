<template>
  <Background>
    <form @submit.prevent="signIn">
      <img src="/static/images/logo.png" alt="Meu Tucano">

      <TInput v-model="email" :required="true" placeholder="Digite seu e-mail"
        :block="true" size="big" class="m-v-10" type="email" />
      <TInput v-model="password" type="password" :required="true" :block="true"
        placeholder="Digite sua senha" size="big" />

      <TButon type="submit" color="info" :block="true" size="big" class="m-t-20 m-b-15">
        Entrar
      </TButon>

      <router-link class="forgot-link" :to="{ name: 'auth.forgot' }">
        esqueci minha senha
      </router-link>
    </form>
  </Background>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Background from '../../../components/Background';
import TButon from 'common/components/TButon'
import TInput from 'common/components/TInput'

export default {
  extend: Background,

  components: {
    Background,
    TButon,
    TInput,
  },

  data() {
    return {
      email: null,
      password: null,
    }
  },

  methods: {
    ...mapActions({
      authenticate: 'sign/LOGIN_ATTEMPT',
    }),

    signIn() {
      this.authenticate({
        email: this.email,
        password: this.password,
      }).then(() => {
        this.$root.$emit('authAttemp');
      });
    },
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 96px;
  height: 61px;
  margin-bottom: 10px;
}

.forgot-link {
  display: block;
  font-size: 12px;
  color: #535353;
}
</style>
