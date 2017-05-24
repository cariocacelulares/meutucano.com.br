<template>
  <div class="user-profile">
    <div class="info">
      <div class="personal">
        <span class="name">{{ user.name }}</span>
        <span class="role">{{ user.role || 'Usuário' }}</span>
      </div>
      <div class="avatar">
        <img :src="user.avatar || '/static/images/logo.png'" alt="Meu Tucano">
      </div>

      <ul class="sub-menu">
        <li><strong>Minha conta</strong></li>
        <li><router-link :to="{ name: 'products' }">Editar perfil</router-link></li>
        <li><router-link :to="{ name: 'products' }">Meus acessos</router-link></li>

        <li><strong>Sistema</strong></li>
        <li><router-link :to="{ name: 'products' }">Configurações</router-link></li>
        <li><a href="#" @click.prevent="signOut" class="text-danger">Sair</a></li>
      </ul>
    </div>

    <!-- <div class="profile">
      <span>Carioca Celulares</span> &nbsp; <Icon name="angle-down" />
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      opened: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'global/GET_USER',
    }),
  },

  methods: {
    ...mapActions({
      logout: 'global/SIGN_OUT',
    }),

    signOut() {
      this.logout()
      this.$router.push({ name: 'sign.signin' })
    },

    close() {
      document.removeEventListener('click', this.close, false);

      this.opened = false
    },

    open(event) {
      event.stopPropagation()

      if (this.opened) {
        this.close()
      } else {
        this.opened = true
        document.addEventListener('click', this.close, false);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.user-profile {
  display: flex;
  align-items: center;

  .info {
    position: relative;
    cursor: pointer;

    &:hover .sub-menu,
    &:focus .sub-menu {
      visibility: visible;
      opacity: 1;
      z-index: 999;
    }

    .sub-menu {
      top: calc(100% + 10px);

      &:before,
      &:after {
        left: auto;
        right: 8px;
      }
    }

    .personal {
      float: left;
      padding-top: 8px;
      margin-right: 10px;

      span {
        display: block;
        text-align: right;
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
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 36px;
        width: 36px;
      }
    }
  }

  .profile {
    height: 30px;
    line-height: 30px;
    margin-left: 20px;
    padding: 0 15px;
    font-size: 12px;
    background-color: $lighter;
    border-radius: $borderRadius;
    color: $darker;
  }
}
</style>
