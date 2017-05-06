<template>
  <span :class="classes" :style="{
    width,
    height,
    }">
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
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
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
@import '~style/vars';

.TLabel {
  line-height: 26px;
  padding: 0 20px;
  border-radius: $borderRadius;
  font-size: 11px;
  font-weight: bold;
  cursor: default;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
