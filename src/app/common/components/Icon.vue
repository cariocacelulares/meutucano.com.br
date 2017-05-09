<template>
  <i :class="classList" :style="{
    color: color,
    fontSize: `${fontSize}px`
  }">{{ (text) ? `&nbsp; ${text}` : '' }}</i>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import { isEmpty } from 'lodash'

export default {
  props: {
    lib: {
      type: String,
      default: 'fa'
    },
    text: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    size: {
      type: String
    },
    fontSize: {
      type: Number
    },
    color: {
      type: String
    },
    classes: {
      type: String,
      default: null
    },
    circular: {
      type: Boolean,
      default: false
    },
    spin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classList() {
      let classList = []

      classList.push('Icon')
      classList.push(this.lib)
      classList.push(this.classes)
      classList.push(this.size)
      classList.push(`${this.lib}-${this.name}`)

      if (this.color) {
        classList.push(`text-${this.color}`)
      }

      if (this.circular) {
        classList.push('circular')
      }

      if (this.spin) {
        classList.push('fa-spin')
      }

      classList = classList.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classList.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Icon {
  font-size: inherit;

  &,
  &:before {
    line-height: 1;
  }

  &.fa {
    font: inherit;

    &:before {
      font: normal normal normal 14px/1 FontAwesome;
      font-size: inherit;
    }
  }

  &.circular {
    padding: 0.3em 0.5em;
    border: 1px solid $dark;
    border-radius: 50%;
  }

  &.small { font-size: 10px }

  &.normal { font-size: 14px }

  &.big { font-size: 16px }

  &.giant { font-size: 24px }
}
</style>
