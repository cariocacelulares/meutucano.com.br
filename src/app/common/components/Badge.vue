<template>
  <span :class="classList">
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
    type: {
      type: String,
      default: 'badge'
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push('Badge')
      classList.push(`bg-${this.color}`)
      classList.push(`text-${this.text}`)
      classList.push(this.type)

      return notEmpty(classList).join(' ')
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;

  &.badge {
    height: 18px;
    padding: 0 8px;
    border-radius: 10px;
    font-size: 10px;
  }

  &.label {
    height: 26px;
    padding: 0 20px;
    font-size: 11px;
    font-weight: bold;
    border-radius: $borderRadius;
  }
}
</style>
