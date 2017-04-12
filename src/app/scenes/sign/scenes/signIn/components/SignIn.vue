<template>
  <div class="login-wrapper">
    <form @submit.prevent="signIn">
      <img src="/static/images/logo.png" alt="Meu Tucano">

      <TInput v-model="email" :required="true" placeholder="Digite seu e-mail"
        :block="true" size="big" class="m-v-10" type="email" />
      <TInput v-model="password" type="password" :required="true" :block="true"
        placeholder="Digite sua senha" size="big" />

      <TButon type="submit" text="Entrar" color="info" :block="true" size="big"
          class="m-t-20 m-b-15" />

      <router-link class="forgot-link" :to="{ name: 'auth.forgot' }">
        esqueci minha senha
      </router-link>
    </form>
  </div>
</template>

<script>
import * as types from '../vuex/types'
import { mapActions, mapGetters } from 'vuex'
import TButon from 'common/components/TButon'
import TInput from 'common/components/TInput'

export default {
  components: {
    TButon,
    TInput,
  },

  data() {
    return {
      email: null,
      password: null,
    }
  },

  computed: {
    ...mapGetters({
      isLoggedIn: types.IS_AUTH,
    }),

    redirectTo () {
      if (this.$route.query.reditect_to) {
        return this.$route.query.redirect_to
      }

      return {
        name: 'dashboard'
      }
    }
  },

  methods: {
    ...mapActions({
      authenticate: types.LOGIN_ATTEMPT,
    }),

    redirectIfAuth() {
      if (this.isLoggedIn) {
        this.$router.push(this.redirectTo)
      }
    },

    signIn() {
      this.authenticate({
        email: this.email,
        password: this.password,
      }).then(() => {
        this.redirectIfAuth()
      });
    },
  },

  beforeMount() {
    this.redirectIfAuth()
  }
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;

  $formWidth: 350px;

  form {
    align-self: center;
    width: $formWidth;
    padding: 40px 20px;
    background-color: #FFF;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);

    @media all and (max-width: $formWidth) {
      width: 100%;
    }

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
  }
}
</style>
