<template>
  <div class="login-wrapper">
    <form @submit.prevent="onSignIn">
      <img src="/static/images/logo.png" alt="Meu Tucano">

      <TInput v-model="email" :required="true" placeholder="Digite seu e-mail"
        :block="true" size="big" class="m-v-10" type="email" />

      <TButon type="submit" text="Recuperar senha" color="info" :block="true" size="big"
          class="m-t-20 m-b-15" />

      <router-link class="back-link" :to="{ name: 'auth.signin' }">
        voltar
      </router-link>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TButon from 'common/components/TButon';
import TInput from 'common/components/TInput';

export default {
  components: {
    TButon,
    TInput,
  },

  data() {
    return {
      email: null,
    };
  },

  methods: {
    ...mapActions({
      signIn: 'sign/ON_LOGIN',
    }),

    onSignIn() {
      const credentials = {
        email: this.email,
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
    padding: 40px 20px;
    background-color: #FFF;
    transform: translate(-50%, -50%);
    text-align: center;
    box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);

    @media all and (max-width: 350px) {
      width: 100%;
    }

    img {
      width: 96px;
      height: 61px;
      margin-bottom: 10px;
    }

    .back-link {
      display: block;
      font-size: 12px;
      color: #535353;
    }
  }
}
</style>
