<template>
  <Background>
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
  </Background>
</template>

<script>
import { Forgot } from '../services'
import Background from '../../../components/Background';
import TButon from 'common/components/TButon';
import TInput from 'common/components/TInput';

export default {
  components: {
    Background,
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
</style>
