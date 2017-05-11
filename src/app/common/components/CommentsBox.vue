<template>
  <div class="CommentsBox">
    <Card v-if="form">
      <form @submit.prevent>
        <!-- <p>* Você pode mencionar um usuário utilizando o sinal @ ou um grupo utilizando #.</p> -->
        <TTextarea v-model="newComment" placeholder="Digite um comentário para o pedido"
          :block="true" theme="dark"></TTextarea>
        <footer>
          <div>
            <TCheckbox v-model="important" label="Marcar como importante" />
            <Help title="Utilize apenas se realmente for importante para o fluxo"
              message="Um comentário importante é diferenciado visualmente dos demais"
              color="darker" />
          </div>
          <TButton color="success" leftIcon="check">Salvar</TButton>
        </footer>
      </form>
    </Card>

    <Card class="comment">
      <div class="card-header" slot="header">
        <UserInfo name="Cleiton Souza" avatar="/static/images/logo.png" sub="há 3 minutos" />
        <Icon name="close" />
      </div>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </Card>

    <Card class="comment" :important="true">
      <div class="card-header" slot="header">
        <UserInfo name="Cleiton Souza" avatar="/static/images/logo.png" sub="há 3 minutos" />
        <Icon name="close" />
      </div>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </Card>

    <Card class="comment">
      <div class="card-header" slot="header">
        <UserInfo name="Cleiton Souza" avatar="/static/images/logo.png" sub="há 3 minutos" />
        <Icon name="close" />
      </div>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </Card>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    form: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
      newComment: null,
      important: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.CommentsBox {
  form,
  .comment {
    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  form {
    > p {
      font-size: 11px;
      color: $dark;
      margin-bottom: 5px;
    }

    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      margin-top: 10px;

      * {
        max-height: 30px;
      }

      > div {
        display: flex;
      }
    }
  }

  .comment {
    > div {
      * {
        color: $darker;
        line-height: 1.6;
      }

      a {
        color: $link;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>
