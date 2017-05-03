<template>
  <button :type="type" :class="classList" @click="click" :style="{
      height,
      width,
    }" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    link: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'button'
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'default'
    },
    text: {
      type: String,
      default: 'white'
    },
    size: {
      type: String,
      default: 'normal'
    },
    classes: {
      type: String,
      default: null
    },
    back: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    width: {
      type: String
    },
  },
  computed: {
    classList() {
      let classList = []

      classList.push('TButton')
      classList.push(this.classes)
      classList.push(`text-${this.text}`)
      classList.push(`bg-${this.color}`)
      classList.push(this.size)

      if (this.block) {
        classList.push('block')
      }

      classList = classList.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classList.join(' ')
    }
  },
  methods: {
    click() {
      if (!this.disabled) {
        if (this.back) {
          window.history.back()
        } else if (this.link) {
          this.$router.push(this.link)
        } else {
          this.$emit('click')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

button {
  display: inline-block;
  font-weight: bold;
  border-radius: 3px;
  cursor: pointer;
  transition: opacity linear 100ms;

  &:not([disabled]):focus,
  &:not([disabled]):hover {
    opacity: .8;
  }

  &.block {
    display: block;
    width: 100%;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: .3;
  }

  // sizes
  &.big {
    height: 50px;
    padding: 0 20px;
  }

  &.small {
    height: 30px;
    padding: 0 12px;
  }
}
</style>
