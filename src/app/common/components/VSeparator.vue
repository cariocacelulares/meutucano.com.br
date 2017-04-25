<template>
  <span :class="classList" :style="{
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
      default: 'light'
    },
    classes: {
      type: String,
      default: null
    },
  },
  computed: {
    classList() {
      let classList = []

      classList.push('VSeparator')
      classList.push(this.classes)
      classList.push(`bg-${this.color}`)

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

.VSeparator {
  display: inline-block;
  height: 100%;
  width: 1px;
}
</style>
