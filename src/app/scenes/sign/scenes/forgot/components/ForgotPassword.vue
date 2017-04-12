<template>
  <div class="forgot-wrapper">
    <form @submit.prevent="forgotPassword">
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
import { Forgot } from '../services'
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
    forgotPassword() {
      Forgot.forgotPassword(this.email)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.forgot-wrapper {
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

    .back-link {
      display: block;
      font-size: 12px;
      color: #535353;
    }
  }
}
</style>
