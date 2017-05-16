<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
    <Toaster/>
  </div>
</template>

<script>
export default {
  created() {
    const show = (attrs) => {
      return this.$store.dispatch('global/ADD_TOAST', attrs)
    }

    Vue.prototype.$toaster = {
      show: (title, message, type) => {
        show({
          title,
          message,
          type
        })
      },
      error: (title, message) => {
        message = (typeof(message) != 'undefined' && message) ? message
          : 'Ocorreu um erro! Contate um adminstrador.'

        show({
          title,
          message,
          type: 'error'
        })
      },
      warning: (title, message) => {
        show({
          title,
          message,
          type: 'warning'
        })
      },
      info: (title, message) => {
        show({
          title,
          message,
          type: 'info'
        })
      },
      success: (title, message) => {
        show({
          title,
          message,
          type: 'success'
        })
      },
    }

    window.axios.interceptors.request.use(
      (config) => {
        this.$Progress.start()

        return config
      },
      (error) => {
        this.$Progress.fail()

        return Promise.reject(error)
      }
    )

    axios.interceptors.response.use(
      (response) => {
        this.$Progress.finish()

        return response.data
      },
      (error) => {
        this.$Progress.fail()

        if (typeof(error.response) !== 'undefined') {
          if (error.response.status == 400) {
            if (typeof(error.response.data.error) !== 'undefined' && error.response.data.error == 'token_not_provided') {
              this.$store.dispatch('global/SIGN_OUT')
              this.$router.push({ name: 'sign.signin' })

              return;
            } else if (typeof(error.response.data.status) !== 'undefined' && error.response.data.status == 'ValidationFail') {
                console.log('ValidationFail', error.response.data)
            }
          } else if (error.response.status == 401) {
            if (
                (typeof(error.response.data.error) !== 'undefined' && error.response.data.error == 'token_expired')
                ||
                (typeof(error.response.data[0]) !== 'undefined' && error.response.data[0] == 'token_expired')
            ) {
              this.$store.dispatch('global/REFRESH_TOKEN')
                .then(() => {},
                  (error) => {
                    this.$store.dispatch('global/SIGN_OUT')
                    this.$router.push({ name: 'sign.signin' })

                    return;
                  }
                )
            }
          }
        }

        return Promise.reject(error);
      }
    )
  },
}
</script>

<style lang="scss">
  @import 'assets/scss/main';
</style>
