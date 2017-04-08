<template>
  <button v-bind:type="type">{{ text }}</button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    text: {
      type: String
    }
  }
}
</script>

<style lang="scss">
</style>
