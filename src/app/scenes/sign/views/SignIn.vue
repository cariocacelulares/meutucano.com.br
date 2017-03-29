<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1>Bem-vindo ao Nexus</h1>

      <form action="" @submit.prevent="onSignIn">
        <input type="text"
          placeholder="Digite seu usuário"
          v-model="email">

        <input type="password"
          placeholder="Digite sua senha"
          v-model="password">

        <button class="btn btn-block btn-large btn-primary" type="submit">
          <i class="fa fa-sign-in"></i>&nbsp;
          Entrar
        </button>
      </form>

      <router-link class="forgot-link" :to="{ name: 'auth.forgot' }">Esqueci minha senha</router-link>
    </div>
  </div>
</template>

<script type="text/babel">
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },

  methods: {
    ...mapActions({
      signIn: 'sign/ON_LOGIN',
    }),

    onSignIn() {
      const credentials = {
        email: this.email,
        password: this.password,
      };

      this.signIn({ ...credentials });
    },
  },
};
</script>

<style scoped>
    /*.login-wrapper {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .login-box {
            max-width: 350px;
            text-align: center;
            margin: 0 30px;

            h1 {
                margin: 30px 0;
                color: #FFF;
            }

            form {
                margin-top: 10px;

                input[type="text"], input[type="password"] {
                    padding: 15px 20px;
                    color: #333;
                    font-size: 14px;
                    width: 100%;
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    border-radius: 3px;
                }
            }

            .forgot-link {
                color: #999;
                text-decoration: none;
                font-size: 14px;
                margin-top: 20px;
                display: inline-block;

                &:hover {
                    color: #FFF;
                }
            }
        }
    }*/
</style>
