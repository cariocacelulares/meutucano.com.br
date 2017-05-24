<template>
  <div :class="{
    CommentsBox: true,
    loading,
    'no-results': !comments.length && !loading,
    'has-form': form,
  }">
    <Card v-if="form">
      <form @submit.prevent="save">
        <!-- <p>* Você pode mencionar um usuário utilizando o sinal @ ou um grupo utilizando #.</p> -->
        <TTextarea v-model="newComment" placeholder="Digite um comentário para o pedido"
          :block="true" theme="dark" :required="true"></TTextarea>
        <footer>
          <div>
            <TCheckbox v-model="important" label="Marcar como importante" />
            <Help title="Utilize apenas se realmente for importante para o fluxo"
              message="Um comentário importante é diferenciado visualmente dos demais"
              color="darker" />
          </div>
          <TButton type="submit" color="success" leftIcon="check">Salvar</TButton>
        </footer>
      </form>
    </Card>

    <Icon v-if="loading" name="refresh" :spin="true" size="giant" />
    <span v-if="!comments.length && !loading">Nenhum comentário {{ onlyImportant ? 'importante' : '' }}</span>

    <Card v-for="comment in comments" :key="comment.id" class="comment" :important="comment.important">
      <div class="card-header" slot="header">
        <UserInfo :name="comment.user.name" :avatar="comment.user.avatar" :sub="comment.created_at | humanDiff" />
        <a href="#" @click.prevent="$confirm(destroy, comment.id)"><Icon v-if="!onlyImportant" name="close" /></a>
      </div>

      <div>{{ comment.comment }}</div>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Boolean,
      default: true
    },
    onlyImportant: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number | String,
      required: true
    },
  },

  data() {
    return {
      newComment: null,
      important: false,
      comments: [],
      loading: true,
    }
  },

  mounted() {
    this.load()
  },

  watch: {
    order() {
      this.load()
    }
  },

  methods: {
    load() {
      if (!this.order) {
        return;
      }

      this.loading = true

      const route = `orders/comments/from/${this.order}`
        + (this.onlyImportant ? '/important' : '')

      axios.get(route).then(
        (response) => {
          this.comments = response.data
          this.loading = false
        },
        (error) => {
          console.log(error)
          this.loading = false
        }
      )
    },

    save() {
      axios.post('orders/comments', {
        order_id: this.order,
        comment: this.newComment,
        important: this.important
      }).then(
        (response) => {
          this.newComment = null
          this.important = false
          this.$toaster.success('Sucesso!', 'Seu comentário foi registrado!')
          this.load()
        },
        (error) => {
          console.log(error)
        }
      )
    },

    destroy(commentId) {
      axios.delete(`orders/comments/${commentId}`).then(
        (response) => {
          this.load()
        },
        (error) => {
          console.log(error)
        }
      )
    },
  }
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

  &.loading,
  &.no-results {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: $darker;

    &.has-form {
      & > span,
      & > .Icon {
        padding: 30px 0;
      }
    }
  }

  .Card {
    width: 100%;
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
