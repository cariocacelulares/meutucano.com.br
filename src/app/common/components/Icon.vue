<template>
  <i :class="name">5</i>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'home'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
