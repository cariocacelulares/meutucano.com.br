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
    }
  },

  computed: {
    classList() {
      let classList = []

      classList.push('Badge')
      classList.push(`bg-${this.color}`)
      classList.push(`text-${this.text}`)

      return notEmpty(classList).join(' ')
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
