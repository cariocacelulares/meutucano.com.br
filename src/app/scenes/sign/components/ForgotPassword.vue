<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1>Esqueci minha senha</h1>

      <form action="">
        <input type="text" placeholder="Digite seu usuário">

        <button class="btn btn-block btn-large btn-primary" type="submit">
          <i class="fa fa-mail"></i>&nbsp;
          Recuperar
        </button>
      </form>

      <router-link class="forgot-link" :to="{ name: 'auth.signin' }">Voltar ao login</router-link>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    methods: {

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
