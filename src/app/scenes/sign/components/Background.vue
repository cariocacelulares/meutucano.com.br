<template>
    <div class="sign-wrapper">
      <slot></slot>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: 'global/IS_AUTH',
    }),

    redirectTo () {
      if (this.$route.query.reditect_to) {
        return this.$route.query.redirect_to
      }

      return {
        name: 'app.dashboard'
      }
    }
  },

  methods: {
    redirectIfAuth() {
      if (this.isLoggedIn) {
        this.$router.push(this.redirectTo)
      }
    },
  },

  mounted() {
    this.$root.$on('authAttemp', () => this.redirectIfAuth())
  },

  beforeDestroy () {
    this.$root.$off('authAttemp')
  },

  beforeMount() {
    this.redirectIfAuth()
  }
}
</script>

<style lang="scss" scoped>
.sign-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;

  $formWidth: 350px;

  > form {
    align-self: center;
    width: $formWidth;
    padding: 40px 20px;
    background-color: #FFF;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);

    @media all and (max-width: $formWidth) {
      width: 100%;
    }
  }
}
</style>
