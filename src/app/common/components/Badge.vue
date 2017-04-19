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

      classes.push('Badge')
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
.Badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  text-align: center;
}
</style>
