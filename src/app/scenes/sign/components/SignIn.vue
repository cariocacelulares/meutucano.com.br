<template>
  <div class="login-wrapper">
    <form>
      <img src="/static/images/logo.png" alt="Meu Tucano">

      <input type="text" v-model="user" placeholder="Digite seu usuário">
      <input type="password" v-model="password" placeholder="Digite sua senha">

      <Button :type="'submit'" :text="'Entrar'"></Button>

      <router-link class="forgot-link" :to="{ name: 'auth.forgot' }">esqueci minha senha</router-link>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  Button
} from 'common/components/Button';

export default {
  components: {
    Button
  },

  data() {
    return {
      user: null,
      password: null,
    };
  },

  methods: {
    ...mapActions({
      signIn: 'sign/ON_LOGIN',
    }),

    onSignIn() {
      const credentials = {
        user: this.user,
        password: this.password,
      };

      this.signIn({ ...credentials });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;

  form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 350px;
    height: 370px;
    padding: 40px 20px;
    background-color: #FFF;
    transform: translate(-50%, -50%);
    text-align: center;

    @media all and (max-width: 350px) {
      width: 100%;
    }

    img {
      width: 96px;
      height: 61px;
    }

    a {
      display: block;
      font-size: 12px;
      color: #535353;
    }
  }
}
</style>
