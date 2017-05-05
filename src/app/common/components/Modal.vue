<template>
  <div class="modal-overlay" @click="close" v-show="show">
    <div class="modal-container" @click.stop>
      <header v-if="title || icon">
        <h1>
          <Icon v-if="icon" :name="icon" />
          {{ title }}
        </h1>
        <button type="button" class="close-modal" @click="close">
          <Icon name="close" color="dark" />
        </button>
      </header>
      <article>
        <slot></slot>
      </article>
      <footer>
        <TButton v-if="cancel" @click="canceled" :color="cancelColor"
          :text="cancelTextColor" :leftIcon="cancelIcon">{{ cancelText }}</TButton>
        <TButton v-if="confirm" @click="confirmed" :color="confirmColor"
          :text="confirmTextColor" :leftIcon="confirmIcon" class="m-l-10">{{ confirmText }}</TButton>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },

  props: {
    name: {
      type: String | Number,
      default: null
    },

    onShow: {
      type: Function,
      default: null
    },
    onClose: {
      type: Function,
      default: null
    },
    onCancel: {
      type: Function,
      default: null
    },
    onConfirm: {
      type: Function,
      default: null
    },

    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },

    cancel: {
      type: Boolean,
      default: true
    },
    cancelColor: {
      type: String,
      default: 'light'
    },
    cancelTextColor: {
      type: String,
      default: 'darker'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    cancelIcon: {
      type: String,
      default: 'angle-left'
    },

    confirm: {
      type: Boolean,
      default: true
    },
    confirmColor: {
      type: String,
      default: 'success'
    },
    confirmTextColor: {
      type: String,
      default: 'white'
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    confirmIcon: {
      type: String,
      default: 'check'
    },
  },

  watch: {
    show() {
      if (this.show && this.onShow) {
        this.onShow()
      }
    }
  },

  methods: {
    close() {
      if (this.onClose) {
        this.onClose()
      }

      this.show = false
    },

    canceled() {
      if (this.onCancel) {
        this.onCancel()
      }

      this.close()
    },

    confirmed() {
      if (this.onConfirm) {
        this.onConfirm()
      }

      this.close()
    },
  },

  mounted() {
    // TODO: remover event listener (?)
    document.addEventListener('keydown', (event) => {
      if (this.show && event.keyCode == 27) {
        this.close()
      }
    })

    this.$root.$on(`show::modal-${this.name}`, () => {
      this.show = true
    })

    this.$root.$on(`close::modal-${this.name}`, () => {
      this.show = false
    })
  },

  beforeDestroy () {
    this.$root.$off(`show::modal-${this.name}`)
    this.$root.$off(`close::modal-${this.name}`)
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($black, .5);
  z-index: 998;

  display: flex;
  align-items: center;
  justify-content: center;

  .modal-container {
    position: relative;
    max-width: 100vw;
    width: 600px;
    padding: 20px;
    box-shadow: $defaultShadow;
    border-radius: 3px;
    background-color: $white;
    z-index: 999;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $light;
      padding-bottom: 10px;
      color: $darker;

      h1 {
        font-size: 14px;
        margin: 0;
        padding: 0;

        .Icon {
          margin-right: 10px;
        }
      }
    }

    article {
      padding: 20px 0;
    }

    footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
