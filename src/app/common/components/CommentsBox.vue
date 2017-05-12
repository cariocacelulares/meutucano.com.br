<template>
  <div class="CommentsBox">
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

    <Card v-for="comment in comments" :key="comment.id" class="comment" :important="comment.important">
      <div class="card-header" slot="header">
        <UserInfo :name="comment.user.name" avatar="/static/images/logo.png" :sub="comment.created_at | humanDiff" />
        <a href="#" @click.prevent="destroy(comment.id)"><Icon v-if="!onlyImportant" name="close" /></a>
      </div>

      <div>{{ comment.comment }}</div>
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
      teste: null
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    load() {
      axios.get(`orders/comments/from/${this.order}`).then(
        (response) => {
          this.comments = response.data
        },
        (error) => {
          console.log(error)
        }
      )
    },

    save() {
      axios.post('orders/comments', {
        order_id: this.order,
        comment: this.newComment
      }).then(
        (response) => {
          this.newComment = ''
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
