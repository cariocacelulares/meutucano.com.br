<template>
  <span :class="classes" :style="{
    height: `${height}px`,
    width: `${width}px`,
    margin: `0 ${spacing}px`,
    marginLeft: `${left}px`,
    marginRight: `${right}px`
    }"></span>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    spacing: {
      type: Number,
      default: 15
    },
    left: {
      type: Number
    },
    right: {
      type: Number
    },
    color: {
      type: String,
      default: 'default'
    },
    class: {
      type: String
    },
  },
  computed: {
    classes() {
      let classes = []

      classes.push('VSeparator')
      classes.push(this.class)
      classes.push(`bg-${this.color}`)

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

.VSeparator {
  display: inline-block;
  height: 100%;
  width: 1px;
}
</style>
