<template>
  <span class="Avatar">
    <img v-if="src" :src="src" :alt="alt">
    <Icon v-if="!src" name="user" color="dark" />
  </span>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: $default;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
