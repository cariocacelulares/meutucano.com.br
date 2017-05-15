<template>
  <span :class="classList" :style="{
      width,
      height,
    }">
    <Icon v-if="icon" :name="icon" />
    <slot></slot>
  </span>
</template>

<script>
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
    classList() {
      let classList = []

      classList.push('Alert')
      classList.push(`bg-${this.color}`)
      classList.push(`text-${this.text}`)

      return notEmpty(classList).join(' ')
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
