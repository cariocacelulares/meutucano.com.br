<template>
  <button :type="type" :class="classes" @click="click">
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
    class: {
      type: String
    }
  },
  computed: {
    classes() {
      let classes = []

      classes.push('TButton')
      classes.push(this.class)
      classes.push(`text-${this.text}`)
      classes.push(`bg-${this.color}`)
      classes.push(this.size)

      if (this.block) {
        classes.push('block')
      }

      if (this.disabled) {
        classes.push('disabled')
      }

      classes = classes.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classes.join(' ')
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
