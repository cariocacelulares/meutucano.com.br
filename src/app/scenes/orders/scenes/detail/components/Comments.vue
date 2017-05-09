<template>
  <ContentBox :discret="true" :boxed="true" :class="{ grid: true, loading: loading }">
    <form @submit.prevent>
      <p>* Você pode mencionar um usuário utilizando o sinal @ ou um grupo utilizando #.</p>
      <textarea v-model="newComment" placeholder="Digite um comentário para o pedido"></textarea>
      <label>
        <input type="checkbox">
        Marcar como importante
        <Icon name="help" />
      </label>
      <TButton color="success" leftIcon="comment">Salvar</TButton>
    </form>

    <article class="comment">
      <header>
        <div class="user">
          <div class="personal">
            <span class="name">Meu Tucano</span>
            <span class="role">há 3 minutos</span>
          </div>
          <div class="avatar">
            <img height="20" src="/static/images/logo.png" alt="Meu Tucano">
          </div>
        </div>
        <Icon name="close" />
      </header>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </article>

    <article class="comment important">
      <header>
        <div class="user">
          <div class="personal">
            <span class="name">Meu Tucano</span>
            <span class="role">há 3 minutos</span>
          </div>
          <div class="avatar">
            <img height="20" src="/static/images/logo.png" alt="Meu Tucano">
          </div>
        </div>
        <Icon name="close" />
      </header>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </article>

    <article class="comment">
      <header>
        <div class="user">
          <div class="personal">
            <span class="name">Meu Tucano</span>
            <span class="role">há 3 minutos</span>
          </div>
          <div class="avatar">
            <img height="20" src="/static/images/logo.png" alt="Meu Tucano">
          </div>
        </div>
        <Icon name="close" />
      </header>

      <div>
        Olá <a href="#">@Lidiane Martins</a>, estamores enviado o produto conforme o cliente solicitou.
      </div>
    </article>
  </ContentBox>
</template>

<script>
export default {
  data() {
    return {
      newComment: null,
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

form,
.comment {
  padding: 20px;
  box-shadow: $defaultShadow;
  border-radius: $borderRadius;
  background-color: $white;

  &:not(:first-child) {
    margin-top: 20px;
  }
}


</style>
