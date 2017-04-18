<template>
  <i :class="classes" :style="{ color: color, fontSize: `${fontSize}px` }"></i>
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
    class: {
      type: String
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
    classes() {
      let classes = []

      classes.push('Icon')
      classes.push(this.lib)
      classes.push(this.class)
      classes.push(this.size)
      classes.push(`${this.lib}-${this.name}`)

      if (this.color) {
        classes.push(`text-${this.color}`)
      }

      if (this.circular) {
        classes.push('circular')
      }

      if (this.spin) {
        classes.push('fa-spin')
      }

      classes = classes.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classes.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Icon {
  font-size: inherit;

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
