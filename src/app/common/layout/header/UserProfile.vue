<template>
  <div class="user-profile">
    <div :class="{ info: true, opened: opened }" @click="open">
      <div class="personal">
        <span class="name">Meu Tucano</span>
        <span class="role">Administrador</span>
      </div>
      <div class="avatar">
        <img src="/static/images/logo.png" alt="Meu Tucano">
      </div>

      <ul class="user-menu">
        <li><a href="#">Perfil</a></li>
        <li><a href="#" @click.prevent="signOut">Sair</a></li>
      </ul>
    </div>

    <div class="profile">
      <span>Carioca Celulares</span> &nbsp; <Icon name="angle-down" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      opened: false
    }
  },

  methods: {
    ...mapActions({
      logout: 'global/SIGN_OUT',
    }),

    signOut() {
      this.logout()
      this.$router.push({ name: 'auth.signin' })
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

    // &:hover .user-menu {
    &.opened .user-menu {
      max-height: 500px;
      transition: all 350ms ease-in;
    }

    .user-menu {
      position: absolute;
      top: 49px;
      left: -10px;
      min-width: calc(100% + 10px);
      text-align: center;
      background-color: $white;
      border-radius: 0 0 3px 3px;
      color: $darker;
      box-shadow: 0px 2px 2px 0 #CCC;

      // transition effect
      max-height: 0;
      transition: all 250ms ease-out;
      overflow: hidden;
      transform: translateZ(0);

      li {
        list-style: none;

        a {
          display: block;
          padding: 8px 10px;
          transition: all linear 200ms;

          &:focus,
          &:hover {
            background-color: $ligther;
            text-decoration: none;
          }
        }
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
    background-color: $ligther;
    border-radius: 3px;
    color: $darker;
  }
}
</style>
