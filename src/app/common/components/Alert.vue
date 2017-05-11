<template>
  <span :class="classes" :style="{
      width,
      height,
    }">
    <Icon v-if="icon" :name="icon" />
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
    icon: {
      type: String,
    },
  },

  computed: {
    classes() {
      let classes = []

      classes.push('Alert')
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

.Alert {
  height: 40px;
  padding: 0 20px;
  border-radius: $borderRadius;
  font-size: 12px;
  cursor: default;

  display: flex;
  align-items: center;

  .Icon {
    margin-right: 15px;
  }
}
</style>
