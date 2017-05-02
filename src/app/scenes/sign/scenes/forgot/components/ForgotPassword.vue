<template>
  <Background>
    <form @submit.prevent="forgotPassword">
      <img src="/static/images/logo.png" alt="Meu Tucano">

      <TInput v-model="email" :required="true" placeholder="Digite seu e-mail"
        :block="true" size="big" class="m-v-10" type="email" />

      <TButton type="submit" color="info" :block="true" size="big" classes="m-t-20 m-b-15">
        Recuperar senha
      </TButton>

      <router-link class="back-link" :to="{ name: 'auth.signin' }">
        voltar
      </router-link>
    </form>
  </Background>
</template>

<script>
import Background from '../../../components/Background'

export default {
  components: {
    Background,
  },

  data() {
    return {
      email: null,
    };
  },

  methods: {
    forgotPassword() {
      axios.post('forgot', this.email)
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
