<template>
  <ContentBox :discret="true" :boxed="true" :class="{ grid: true, loading: loading }">
    <Card>
      <form @submit.prevent>
        <!-- <p>* Você pode mencionar um usuário utilizando o sinal @ ou um grupo utilizando #.</p> -->
        <TTextarea v-model="newComment" placeholder="Digite um comentário para o pedido"
          :block="true" theme="dark"></TTextarea>
        <footer>
          <div>
            <TCheckbox v-model="important" label="Marcar como importante" />
            <Help title="Utilize apenas se realmente for importante para o fluxo" message="Um comentário importante é diferenciado visualmente dos demais" color="darker" />
          </div>
          <TButton color="success" leftIcon="commenting-o">Salvar</TButton>
        </footer>
      </form>
    </Card>

    <Card class="comment">
      <div class="card-header" slot="header">
        <div class="user">
          <div class="avatar">
            <img src="/static/images/logo.png" alt="Meu Tucano">
          </div>
          <div class="personal">
            <span class="name">Meu Tucano</span>
            <span class="role">há 3 minutos</span>
          </div>
        </div>
        <Icon name="close" />
      </div>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </Card>

    <Card class="comment important">
      <div class="card-header" slot="header">
        <div class="user">
          <div class="avatar">
            <img src="/static/images/logo.png" alt="Meu Tucano">
          </div>
          <div class="personal">
            <span class="name">Meu Tucano</span>
            <span class="role">há 3 minutos</span>
          </div>
        </div>
        <Icon name="close" />
      </div>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </Card>

    <Card class="comment">
      <div class="card-header" slot="header">
        <div class="user">
          <div class="avatar">
            <img src="/static/images/logo.png" alt="Meu Tucano">
          </div>
          <div class="personal">
            <span class="name">Meu Tucano</span>
            <span class="role">há 3 minutos</span>
          </div>
        </div>
        <Icon name="close" />
      </div>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </Card>
  </ContentBox>
</template>

<script>
export default {
  data() {
    return {
      newComment: null,
      loading: false,
      important: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

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
  &.important {
    border-top: 5px solid $warning;
  }

  > div {
    color: $darker;

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

  header {
    .user {
      display: flex;
      align-items: center;

      .personal {
        margin-left: 10px;

        span {
          display: block;
        }

        .name {
          font-size: 12px;
          color: $darker;
          padding-bottom: 2px;
          font-weight: bold;
        }

        .role {
          font-size: 11px;
          color: $dark;
        }
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
