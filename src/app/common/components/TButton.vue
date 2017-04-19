<template>
  <button :type="type" :class="classList" @click="click">
    <slot></slot>
  </button>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
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
    }
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

      if (this.disabled) {
        classList.push('disabled')
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
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

button {
  display: inline-block;
  border-radius: 3px;
  cursor: pointer;
  transition: opacity linear 100ms;

  &:not(.disabled):focus,
  &:not(.disabled):hover {
    opacity: .8;
  }

  &.block {
    display: block;
    width: 100%;
  }

  &.disabled {
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
