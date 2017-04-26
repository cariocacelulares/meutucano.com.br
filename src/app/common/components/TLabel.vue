<template>
  <span :class="classes">
    <slot></slot>
  </span>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    color: {
      type: String,
      default: 'info'
    },
    text: {
      type: String,
      default: 'white'
    }
  },

  computed: {
    classes() {
      let classes = []

      classes.push('TLabel')
      classes.push(`bg-${this.color}`)
      classes.push(`text-${this.text}`)

      classes = classes.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classes.join(' ')
    }
  },
}
</script>

<style lang="scss" scoped>
.TLabel {
  display: inline-block;
  line-height: 26px;
  padding: 0 20px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  cursor: default;
}
</style>
