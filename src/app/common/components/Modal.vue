<template>
  <transition name="fade">
    <div class="modal-overlay" @click="close" v-show="show">
      <div :class="{
        'modal-container': true,
        'has-left': hasLeft,
        'has-right': hasRight,
      }" @click.stop>
        <aside v-if="hasLeft" class="left">
          <slot name="left"></slot>
        </aside>

        <div class="modal-content">
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

        <aside v-if="hasRight" class="right">
          <slot name="right"></slot>
        </aside>
      </div>
    </div>
  </transition>
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
      default: 'close'
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

  computed: {
    hasLeft() {
      return (typeof(this.$slots.left) !== 'undefined')
    },

    hasRight() {
      return (typeof(this.$slots.right) !== 'undefined')
    },
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

    pressEscape(event) {
      if (this.show && event.keyCode == 27) {
        this.close()
        document.removeEventListener('keydown', this.pressEscape)
      }
    },
  },

  mounted() {
    document.addEventListener('keydown', this.pressEscape)

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
    max-width: 100vw;
    width: 600px;
    max-height: calc(100vh - 20px);
    box-shadow: $defaultShadow;
    border-radius: $borderRadius;
    background-color: $white;
    overflow-y: auto;
    z-index: 999;

    &.has-left,
    &.has-right {
      width: 950px;
      display: grid;
      grid-gap: 0;
      grid-auto-flow: row;
      grid-template-rows: 1fr;
      // grid-template-rows: calc(100vh - 20px);
    }

    &.has-left.has-right {
      grid-template-columns: 200px auto 200px;
    }

    &.has-left:not(.has-right) {
      grid-template-columns: auto 350px;
    }

    &.has-right:not(.has-left) {
      grid-template-columns: auto 350px;
    }

    .left,
    .right {
      padding: 20px;
      background-color: $lighter;
      overflow-y: auto;
    }

    .modal-content {
      position: relative;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

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
      margin-top: auto;
    }
  }
}
</style>
